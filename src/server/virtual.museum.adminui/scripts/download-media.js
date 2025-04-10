#!/usr/bin/env node

/**
 * Media File Migration Script
 * 
 * This script downloads media files from external URLs, saves them to the local media directory,
 * and updates the database records with the new local URLs.
 * 
 * Usage:
 *   node download-media.js [--dry-run] [--limit=<number>]
 * 
 * Options:
 *   --dry-run    Only log actions without making changes
 *   --limit=N    Process only N files (for testing)
 */

// Import required modules
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const { promisify } = require('util');
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const { v4: uuidv4 } = require('uuid');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Configuration
const MEDIA_UPLOAD_DIR = process.env.MEDIA_UPLOAD_DIR || 'E:\\Media';
const DB_PATH = process.env.DB_PATH || 'E:\\db\\virtualmuseum.db';
const API_BASE_URL = '/api/media/file/';

// Parse command line arguments
const args = process.argv.slice(2);
const isDryRun = args.includes('--dry-run');
const limitArg = args.find(arg => arg.startsWith('--limit='));
const limit = limitArg ? parseInt(limitArg.split('=')[1], 10) : Infinity;

// Ensure media directory exists
if (!fs.existsSync(MEDIA_UPLOAD_DIR)) {
  fs.mkdirSync(MEDIA_UPLOAD_DIR, { recursive: true });
  console.log(`Created media directory: ${MEDIA_UPLOAD_DIR}`);
}

// Helper function to download a file
async function downloadFile(url, filePath) {
  return new Promise((resolve, reject) => {
    // Skip if file already exists
    if (fs.existsSync(filePath)) {
      console.log(`File already exists: ${filePath}`);
      return resolve(filePath);
    }

    // Handle different URL protocols
    const client = url.startsWith('https') ? https : http;
    
    const request = client.get(url, (response) => {
      // Handle redirects
      if (response.statusCode === 301 || response.statusCode === 302) {
        return downloadFile(response.headers.location, filePath)
          .then(resolve)
          .catch(reject);
      }
      
      // Check if the request was successful
      if (response.statusCode !== 200) {
        return reject(new Error(`Failed to download ${url}: ${response.statusCode} ${response.statusMessage}`));
      }
      
      // Create write stream
      const fileStream = fs.createWriteStream(filePath);
      
      // Pipe the response to the file
      response.pipe(fileStream);
      
      // Handle errors
      fileStream.on('error', (err) => {
        fs.unlink(filePath, () => {}); // Delete the file if there was an error
        reject(err);
      });
      
      // Resolve when the file is downloaded
      fileStream.on('finish', () => {
        fileStream.close();
        resolve(filePath);
      });
    });
    
    // Handle request errors
    request.on('error', (err) => {
      fs.unlink(filePath, () => {}); // Delete the file if there was an error
      reject(err);
    });
    
    // Set timeout
    request.setTimeout(30000, () => {
      request.abort();
      fs.unlink(filePath, () => {}); // Delete the file if there was a timeout
      reject(new Error(`Request timeout for ${url}`));
    });
  });
}

// Helper function to get file extension from URL or content type
function getFileExtension(url, contentType) {
  // Try to get extension from URL
  const urlExtension = path.extname(url).toLowerCase();
  if (urlExtension && urlExtension.length > 1 && urlExtension.length < 6) {
    return urlExtension;
  }
  
  // If no extension in URL, try to determine from content type
  if (contentType) {
    const mimeToExt = {
      'image/jpeg': '.jpg',
      'image/jpg': '.jpg',
      'image/png': '.png',
      'image/gif': '.gif',
      'video/mp4': '.mp4',
      'audio/mpeg': '.mp3',
      'audio/mp3': '.mp3',
      'audio/wav': '.wav'
    };
    
    return mimeToExt[contentType] || '';
  }
  
  // Default to empty string if we can't determine the extension
  return '';
}

// Main function
async function main() {
  console.log('Starting media file migration...');
  console.log(`Database: ${DB_PATH}`);
  console.log(`Media directory: ${MEDIA_UPLOAD_DIR}`);
  console.log(`Dry run: ${isDryRun}`);
  if (limit !== Infinity) {
    console.log(`Limit: ${limit} files`);
  }
  
  // Connect to the database
  const db = await open({
    filename: DB_PATH,
    driver: sqlite3.Database
  });
  
  try {
    // Get all media files with external URLs
    const mediaFiles = await db.all(`
      SELECT Id, FileName, Name, Description, DurationInSeconds, Type, Url
      FROM MediaFiles
      WHERE Url NOT LIKE '${API_BASE_URL}%'
      LIMIT ?
    `, limit);
    
    console.log(`Found ${mediaFiles.length} media files with external URLs`);
    
    // Process each media file
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < mediaFiles.length; i++) {
      const mediaFile = mediaFiles[i];
      console.log(`\nProcessing file ${i + 1}/${mediaFiles.length}: ${mediaFile.Name} (ID: ${mediaFile.Id})`);
      
      try {
        // Skip if URL is already local
        if (mediaFile.Url.startsWith(API_BASE_URL)) {
          console.log('URL is already local, skipping');
          continue;
        }
        
        // Skip empty URLs
        if (!mediaFile.Url) {
          console.log('URL is empty, skipping');
          continue;
        }
        
        // Log the current URL
        console.log(`Current URL: ${mediaFile.Url}`);
        
        // Determine file extension
        const fileExtension = getFileExtension(mediaFile.Url, null);
        if (!fileExtension) {
          console.warn(`Could not determine file extension for ${mediaFile.Url}, skipping`);
          errorCount++;
          continue;
        }
        
        // Generate new filename using the ID
        const newFilename = `${mediaFile.Id}${fileExtension}`;
        const filePath = path.join(MEDIA_UPLOAD_DIR, newFilename);
        
        // Download the file
        if (!isDryRun) {
          console.log(`Downloading to ${filePath}...`);
          await downloadFile(mediaFile.Url, filePath);
        } else {
          console.log(`[DRY RUN] Would download ${mediaFile.Url} to ${filePath}`);
        }
        
        // Generate new URL
        const newUrl = `${API_BASE_URL}${newFilename}`;
        console.log(`New URL: ${newUrl}`);
        
        // Update the database
        if (!isDryRun) {
          await db.run(`
            UPDATE MediaFiles
            SET Url = ?
            WHERE Id = ?
          `, newUrl, mediaFile.Id);
          console.log('Database updated');
        } else {
          console.log(`[DRY RUN] Would update database for ID ${mediaFile.Id}`);
        }
        
        successCount++;
      } catch (error) {
        console.error(`Error processing file ${mediaFile.Id}: ${error.message}`);
        errorCount++;
      }
    }
    
    console.log('\nMigration completed!');
    console.log(`Successfully processed: ${successCount} files`);
    console.log(`Errors: ${errorCount} files`);
    
  } finally {
    // Close the database connection
    await db.close();
  }
}

// Run the main function
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
