#!/usr/bin/env python
"""
Media File Migration Script

This script downloads media files from external URLs, saves them to the local media directory,
and updates the database records with the new local URLs.

Usage:
  python download_media.py [--dry-run] [--limit=<number>]

Options:
  --dry-run    Only log actions without making changes
  --limit=N    Process only N files (for testing)
"""

import os
import sys
import argparse
import sqlite3
import requests
import uuid
import mimetypes
from pathlib import Path
from urllib.parse import urlparse
from dotenv import load_dotenv
from tqdm import tqdm

# Initialize mime types
mimetypes.init()

# Load environment variables
script_dir = Path(__file__).parent
project_dir = script_dir.parent
load_dotenv(project_dir / '.env.local')
load_dotenv(project_dir / '.env')

# Configuration
MEDIA_UPLOAD_DIR = os.getenv('MEDIA_UPLOAD_DIR', r'E:\Media')
DB_PATH = os.getenv('DB_PATH', r'E:\db\virtualmuseum.db')
API_BASE_URL = '/api/media/file/'

def parse_args():
    """Parse command line arguments."""
    parser = argparse.ArgumentParser(description='Download media files and update database.')
    parser.add_argument('--dry-run', action='store_true', help='Only log actions without making changes')
    parser.add_argument('--limit', type=int, default=None, help='Process only N files (for testing)')
    return parser.parse_args()

def ensure_directory_exists(directory):
    """Ensure the specified directory exists."""
    os.makedirs(directory, exist_ok=True)
    print(f"Ensured directory exists: {directory}")

def get_file_extension(url, content_type=None):
    """Get file extension from URL or content type."""
    # Try to get extension from URL
    parsed_url = urlparse(url)
    path = parsed_url.path
    ext = os.path.splitext(path)[1].lower()
    
    if ext and len(ext) > 1 and len(ext) < 6:
        return ext
    
    # If no extension in URL, try to determine from content type
    if content_type:
        ext = mimetypes.guess_extension(content_type)
        if ext:
            return ext
    
    # Mapping for common mime types (fallback)
    mime_to_ext = {
        'image/jpeg': '.jpg',
        'image/jpg': '.jpg',
        'image/png': '.png',
        'image/gif': '.gif',
        'video/mp4': '.mp4',
        'audio/mpeg': '.mp3',
        'audio/mp3': '.mp3',
        'audio/wav': '.wav'
    }
    
    return mime_to_ext.get(content_type, '')

def download_file(url, file_path):
    """Download a file from URL to the specified path."""
    # Skip if file already exists
    if os.path.exists(file_path):
        print(f"File already exists: {file_path}")
        return file_path
    
    # Create parent directories if they don't exist
    os.makedirs(os.path.dirname(file_path), exist_ok=True)
    
    # Download with progress
    print(f"Downloading {url} to {file_path}...")
    
    try:
        # Stream the download
        with requests.get(url, stream=True, timeout=30) as response:
            response.raise_for_status()
            
            # Get content length if available
            total_size = int(response.headers.get('content-length', 0))
            
            # Get content type for extension detection if needed
            content_type = response.headers.get('content-type')
            
            # Create progress bar
            progress_bar = tqdm(total=total_size, unit='B', unit_scale=True, desc=os.path.basename(file_path))
            
            # Write to file
            with open(file_path, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    if chunk:
                        f.write(chunk)
                        progress_bar.update(len(chunk))
            
            progress_bar.close()
            
            return file_path
    except requests.exceptions.RequestException as e:
        # Clean up partial file if download failed
        if os.path.exists(file_path):
            os.unlink(file_path)
        raise Exception(f"Failed to download {url}: {str(e)}")

def main():
    """Main function."""
    args = parse_args()
    
    print("Starting media file migration...")
    print(f"Database: {DB_PATH}")
    print(f"Media directory: {MEDIA_UPLOAD_DIR}")
    print(f"Dry run: {args.dry_run}")
    if args.limit:
        print(f"Limit: {args.limit} files")
    
    # Ensure media directory exists
    ensure_directory_exists(MEDIA_UPLOAD_DIR)
    
    # Connect to the database
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    
    try:
        # Get all media files with external URLs
        limit_clause = f"LIMIT {args.limit}" if args.limit else ""
        cursor.execute(f"""
            SELECT Id, FileName, Name, Description, DurationInSeconds, Type, Url
            FROM MediaFiles
            WHERE Url NOT LIKE '{API_BASE_URL}%'
            {limit_clause}
        """)
        
        media_files = cursor.fetchall()
        print(f"Found {len(media_files)} media files with external URLs")
        
        # Process each media file
        success_count = 0
        error_count = 0
        
        for i, media_file in enumerate(media_files):
            print(f"\nProcessing file {i + 1}/{len(media_files)}: {media_file['Name']} (ID: {media_file['Id']})")
            
            try:
                # Skip if URL is already local
                if media_file['Url'].startswith(API_BASE_URL):
                    print('URL is already local, skipping')
                    continue
                
                # Skip empty URLs
                if not media_file['Url']:
                    print('URL is empty, skipping')
                    continue
                
                # Log the current URL
                print(f"Current URL: {media_file['Url']}")
                
                # Make a HEAD request to get content type
                try:
                    head_response = requests.head(media_file['Url'], timeout=10)
                    content_type = head_response.headers.get('content-type')
                except:
                    content_type = None
                
                # Determine file extension
                file_extension = get_file_extension(media_file['Url'], content_type)
                if not file_extension:
                    print(f"Could not determine file extension for {media_file['Url']}, skipping")
                    error_count += 1
                    continue
                
                # Generate new filename using the ID
                new_filename = f"{media_file['Id']}{file_extension}"
                file_path = os.path.join(MEDIA_UPLOAD_DIR, new_filename)
                
                # Download the file
                if not args.dry_run:
                    download_file(media_file['Url'], file_path)
                else:
                    print(f"[DRY RUN] Would download {media_file['Url']} to {file_path}")
                
                # Generate new URL
                new_url = f"{API_BASE_URL}{new_filename}"
                print(f"New URL: {new_url}")
                
                # Update the database
                if not args.dry_run:
                    cursor.execute("""
                        UPDATE MediaFiles
                        SET Url = ?
                        WHERE Id = ?
                    """, (new_url, media_file['Id']))
                    conn.commit()
                    print('Database updated')
                else:
                    print(f"[DRY RUN] Would update database for ID {media_file['Id']}")
                
                success_count += 1
            except Exception as e:
                print(f"Error processing file {media_file['Id']}: {str(e)}")
                error_count += 1
        
        print('\nMigration completed!')
        print(f"Successfully processed: {success_count} files")
        print(f"Errors: {error_count} files")
        
    finally:
        # Close the database connection
        conn.close()

if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print(f"Fatal error: {str(e)}")
        sys.exit(1)
