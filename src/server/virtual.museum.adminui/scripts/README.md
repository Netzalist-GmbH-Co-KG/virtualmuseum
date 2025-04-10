# Media Migration Scripts

This directory contains scripts for managing media files in the Virtual Museum Admin UI.

## download_media.py

This Python script downloads media files from external URLs (CDN), saves them to the local media directory, and updates the database records with the new local URLs.

### Prerequisites

This script uses a Python virtual environment. The virtual environment and required packages are already set up in the `.venv` directory.

To activate the virtual environment:

```bash
# On Windows
scripts\.venv\Scripts\activate

# On Linux/Mac
source scripts/.venv/bin/activate
```

The required packages are listed in `requirements.txt` and include:
- requests
- python-dotenv
- tqdm
- uuid

### Configuration

The script uses the following environment variables from `.env` or `.env.local`:

- `MEDIA_UPLOAD_DIR`: Directory where media files will be stored (default: `E:\Media`)
- `DB_PATH`: Path to the SQLite database (default: `E:\db\virtualmuseum.db`)

### Usage

```bash
# Activate the virtual environment first
scripts\.venv\Scripts\activate

# Test run (doesn't make any changes)
python scripts/download_media.py --dry-run

# Test with a limited number of files
python scripts/download_media.py --dry-run --limit=5

# Run the actual migration
python scripts/download_media.py

# Run the migration with a limit
python scripts/download_media.py --limit=20
```

### What the Script Does

1. Connects to the SQLite database
2. Finds all media files with external URLs (not starting with `/api/media/file/`)
3. For each file:
   - Downloads the file from the external URL
   - Saves it to the local media directory using the file's ID as the filename
   - Updates the database record with the new local URL
4. Provides a summary of successful and failed operations

### Error Handling

The script handles various error conditions:
- Network errors during download
- Redirects
- Timeouts
- Missing file extensions
- File system errors

Failed files are logged but don't stop the entire process.
