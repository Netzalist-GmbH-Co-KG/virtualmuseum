import { NextRequest, NextResponse } from 'next/server';
import { mediaRepository, MediaType } from '@/lib/mediaRepository';
import { ErrorResponse } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';
import { writeFile, mkdir } from 'fs/promises';
import { join, dirname, extname } from 'path';
import { existsSync } from 'fs';

// Configuration for media upload directory
const MEDIA_UPLOAD_DIR = process.env.MEDIA_UPLOAD_DIR || 'E:\\Media';

/**
 * POST handler for /api/media/upload
 * Uploads a media file to the server and creates a database entry
 */
export async function POST(request: NextRequest) {
  try {
    // Ensure the upload directory exists
    if (!existsSync(MEDIA_UPLOAD_DIR)) {
      await mkdir(MEDIA_UPLOAD_DIR, { recursive: true });
    }
    
    // Parse the multipart form data
    const formData = await request.formData();
    
    // Get the file from the form data
    const file = formData.get('file') as File;
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    
    // Get other form fields
    const type = formData.get('type') as string;
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    
    // Validate required fields
    if (!type) {
      return NextResponse.json({ error: 'Media type is required' }, { status: 400 });
    }
    
    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }
    
    // Map string type to numeric type
    const typeMap: Record<string, MediaType> = {
      'Image2D': MediaType.Image2D,
      'Image3D': MediaType.Image3D,
      'Image360': MediaType.Image360Degree,
      'Video2D': MediaType.Video2D,
      'Video3D': MediaType.Video3D,
      'Video360': MediaType.Video360Degree,
      'Audio': MediaType.Audio
    };
    
    const numericType = typeMap[type];
    if (numericType === undefined) {
      return NextResponse.json({ error: 'Invalid media type' }, { status: 400 });
    }
    
    // Generate a unique ID for the file
    const fileId = uuidv4();
    
    // Get the file extension
    const fileExtension = extname(file.name).toLowerCase();
    
    // Validate file extension based on type
    const validExtensions: Record<MediaType, string[]> = {
      [MediaType.Image2D]: ['.jpg', '.jpeg', '.png', '.gif'],
      [MediaType.Image3D]: ['.jpg', '.jpeg', '.png', '.gif'],
      [MediaType.Image360Degree]: ['.jpg', '.jpeg', '.png', '.gif'],
      [MediaType.Video2D]: ['.mp4'],
      [MediaType.Video3D]: ['.mp4'],
      [MediaType.Video360Degree]: ['.mp4'],
      [MediaType.Audio]: ['.mp3', '.wav']
    };
    
    if (!validExtensions[numericType].includes(fileExtension)) {
      return NextResponse.json({
        error: `Invalid file extension for ${type}. Allowed extensions: ${validExtensions[numericType].join(', ')}`
      }, { status: 400 });
    }
    
    // Create a unique filename
    const fileName = `${fileId}${fileExtension}`;
    const filePath = join(MEDIA_UPLOAD_DIR, fileName);
    
    // Get file content as ArrayBuffer
    const fileBuffer = await file.arrayBuffer();
    
    // Write the file to disk
    await writeFile(filePath, Buffer.from(fileBuffer));
    
    // Calculate duration for audio and video files (in a real app, you'd use a library like ffprobe)
    // For now, we'll just set a default value
    let durationInSeconds = 0;
    if (numericType === MediaType.Audio || 
        numericType === MediaType.Video2D || 
        numericType === MediaType.Video3D || 
        numericType === MediaType.Video360Degree) {
      // In a real application, you would extract the actual duration
      durationInSeconds = 0;
    }
    
    // Create a URL for the file (in a real app, this might be a CDN URL)
    // For local development, we'll use a relative URL
    const fileUrl = `/api/media/file/${fileName}`;
    
    // Create a database entry for the media file
    const mediaFile = mediaRepository.createMediaFile({
      Description: description || null,
      DurationInSeconds: durationInSeconds,
      FileName: file.name,
      Name: name,
      Type: numericType,
      Url: fileUrl
    });
    
    // Map the database media type to string representation for the response
    const mediaTypeMap: Record<number, string> = {
      [MediaType.Image2D]: 'Image2D',
      [MediaType.Image3D]: 'Image3D',
      [MediaType.Image360Degree]: 'Image360',
      [MediaType.Video2D]: 'Video2D',
      [MediaType.Video3D]: 'Video3D',
      [MediaType.Video360Degree]: 'Video360',
      [MediaType.Audio]: 'Audio'
    };
    
    // Format the response
    const formattedMediaFile = {
      id: mediaFile.Id,
      fileName: mediaFile.FileName || '',
      name: mediaFile.Name || '',
      description: mediaFile.Description || '',
      durationInSeconds: mediaFile.DurationInSeconds,
      type: mediaTypeMap[mediaFile.Type] || 'Unknown',
      url: mediaFile.Url || '/placeholder.svg',
      usedInPresentations: []
    };
    
    return NextResponse.json(formattedMediaFile);
  } catch (error) {
    console.error('Error uploading media file:', error);
    
    // Return error response
    const errorResponse: ErrorResponse = {
      error: error instanceof Error ? error.message : 'An unknown error occurred',
      status: 500
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
