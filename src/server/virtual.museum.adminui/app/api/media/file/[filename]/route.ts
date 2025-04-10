import { NextRequest, NextResponse } from 'next/server';
import { join } from 'path';
import { readFile, stat } from 'fs/promises';
import { existsSync } from 'fs';

// Configuration for media upload directory
const MEDIA_UPLOAD_DIR = process.env.MEDIA_UPLOAD_DIR || 'E:\\Media';

/**
 * GET handler for /api/media/file/[filename]
 * Serves media files from the upload directory
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const { filename } = await params;
    
    // Validate filename to prevent directory traversal attacks
    if (!filename || filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return new NextResponse('Invalid filename', { status: 400 });
    }
    
    const filePath = join(MEDIA_UPLOAD_DIR, filename);
    
    // Check if file exists
    if (!existsSync(filePath)) {
      return new NextResponse('File not found', { status: 404 });
    }
    
    // Get file stats
    const fileStats = await stat(filePath);
    
    // Read file content
    const fileBuffer = await readFile(filePath);
    
    // Determine content type based on file extension
    const contentType = getContentType(filename);
    
    // Set appropriate headers
    const headers = new Headers({
      'Content-Type': contentType,
      'Content-Length': fileStats.size.toString(),
      'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
    });
    
    return new NextResponse(fileBuffer, { headers });
  } catch (error) {
    console.error('Error serving media file:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

/**
 * Determine content type based on file extension
 */
function getContentType(filename: string): string {
  const extension = filename.split('.').pop()?.toLowerCase();
  
  switch (extension) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'gif':
      return 'image/gif';
    case 'mp4':
      return 'video/mp4';
    case 'mp3':
      return 'audio/mpeg';
    case 'wav':
      return 'audio/wav';
    default:
      return 'application/octet-stream';
  }
}
