import { NextRequest, NextResponse } from 'next/server';
import { mediaRepository, MediaType } from '@/lib/mediaRepository';
import { ErrorResponse } from '@/lib/types';

/**
 * GET handler for /api/media
 * Retrieves media files with optional filtering by search term and type
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const searchTerm = searchParams.get('search') || '';
    const typeFilter = searchParams.get('type') || 'all';
    
    // Get all media files
    let mediaFiles = mediaRepository.getAllMediaFiles();
    
    // Apply search filter if provided
    if (searchTerm) {
      mediaFiles = mediaRepository.searchMediaFiles(searchTerm);
    }
    
    // Apply type filter if provided
    if (typeFilter !== 'all') {
      const typeMapping: Record<string, MediaType[]> = {
        'audio': [MediaType.Audio],
        'video': [MediaType.Video2D, MediaType.Video360],
        'image': [MediaType.Image2D, MediaType.Image360],
        '360': [MediaType.Video360, MediaType.Image360],
        'document': [MediaType.Document],
        'other': [MediaType.Other]
      };
      
      const types = typeMapping[typeFilter];
      if (types) {
        mediaFiles = mediaFiles.filter(file => types.includes(file.Type));
      }
    }
    
    // Map the database media types to string representations
    const mediaTypeMap: Record<number, string> = {
      [MediaType.Audio]: 'Audio',
      [MediaType.Video2D]: 'Video2D',
      [MediaType.Video360]: 'Video360',
      [MediaType.Image2D]: 'Image2D',
      [MediaType.Image360]: 'Image360',
      [MediaType.Document]: 'Document',
      [MediaType.Other]: 'Other'
    };
    
    // Format the response
    const formattedMediaFiles = mediaFiles.map(file => ({
      id: file.Id,
      fileName: file.FileName || '',
      name: file.Name || '',
      description: file.Description || '',
      durationInSeconds: file.DurationInSeconds,
      type: mediaTypeMap[file.Type] || 'Unknown',
      url: file.Url || '/placeholder.svg'
    }));
    
    return NextResponse.json({
      mediaFiles: formattedMediaFiles
    });
  } catch (error) {
    console.error('Error fetching media files:', error);
    
    // Return error response
    const errorResponse: ErrorResponse = {
      error: error instanceof Error ? error.message : 'An unknown error occurred',
      status: 500
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
