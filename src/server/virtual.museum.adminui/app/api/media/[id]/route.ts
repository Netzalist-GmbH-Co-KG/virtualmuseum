import { NextRequest, NextResponse } from 'next/server';
import { mediaRepository, MediaType } from '@/lib/mediaRepository';
import { ErrorResponse } from '@/lib/types';
import { z } from 'zod';

// Schema for validating media update requests
const mediaUpdateSchema = z.object({
  Name: z.string().optional(),
  Description: z.string().nullable().optional(),
  DurationInSeconds: z.number().min(0).optional(),
  Type: z.number().int().min(0).max(6).optional(),
  Url: z.string().nullable().optional()
});

/**
 * GET handler for /api/media/[id]
 * Retrieves a single media file by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    
    // Get the media file
    const mediaFile = mediaRepository.getMediaFileById(id);
    
    if (!mediaFile) {
      return NextResponse.json({ error: 'Media file not found' }, { status: 404 });
    }
    
    // Map the database media type to string representation
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
      // For now, we'll return an empty array for usedInPresentations
      // In a future implementation, we could query the database to find presentations using this media
      usedInPresentations: []
    };
    
    return NextResponse.json(formattedMediaFile);
  } catch (error) {
    console.error('Error fetching media file:', error);
    
    // Return error response
    const errorResponse: ErrorResponse = {
      error: error instanceof Error ? error.message : 'An unknown error occurred',
      status: 500
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

/**
 * PUT handler for /api/media/[id]
 * Updates a media file
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // Check if the media file exists
    const existingMediaFile = mediaRepository.getMediaFileById(id);
    
    if (!existingMediaFile) {
      return NextResponse.json({ error: 'Media file not found' }, { status: 404 });
    }
    
    // Parse and validate the request body
    const requestBody = await request.json();
    
    // Map the string type to numeric type if provided
    if (requestBody.type) {
      const typeMap: Record<string, number> = {
        'Image2D': MediaType.Image2D,
        'Image3D': MediaType.Image3D,
        'Image360': MediaType.Image360Degree,
        'Video2D': MediaType.Video2D,
        'Video3D': MediaType.Video3D,
        'Video360': MediaType.Video360Degree,
        'Audio': MediaType.Audio
      };
      
      requestBody.Type = typeMap[requestBody.type] !== undefined ? typeMap[requestBody.type] : existingMediaFile.Type;
    }
    
    // Prepare the update data
    const updateData = {
      Name: requestBody.name !== undefined ? requestBody.name : undefined,
      Description: requestBody.description !== undefined ? requestBody.description : undefined,
      DurationInSeconds: requestBody.durationInSeconds !== undefined ? requestBody.durationInSeconds : undefined,
      Type: requestBody.Type !== undefined ? requestBody.Type : undefined,
      Url: requestBody.url !== undefined ? requestBody.url : undefined
    };
    
    // Validate the update data
    const validationResult = mediaUpdateSchema.safeParse(updateData);
    
    if (!validationResult.success) {
      return NextResponse.json({
        error: 'Invalid update data',
        details: validationResult.error.errors
      }, { status: 400 });
    }
    
    // Filter out undefined values
    const filteredUpdateData = Object.fromEntries(
      Object.entries(updateData).filter(([_, value]) => value !== undefined)
    );
    
    // Update the media file
    const updatedMediaFile = mediaRepository.updateMediaFile(id, filteredUpdateData);
    
    // Map the database media type to string representation
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
      id: updatedMediaFile.Id,
      fileName: updatedMediaFile.FileName || '',
      name: updatedMediaFile.Name || '',
      description: updatedMediaFile.Description || '',
      durationInSeconds: updatedMediaFile.DurationInSeconds,
      type: mediaTypeMap[updatedMediaFile.Type] || 'Unknown',
      url: updatedMediaFile.Url || '/placeholder.svg',
      usedInPresentations: []
    };
    
    return NextResponse.json(formattedMediaFile);
  } catch (error) {
    console.error('Error updating media file:', error);
    
    // Return error response
    const errorResponse: ErrorResponse = {
      error: error instanceof Error ? error.message : 'An unknown error occurred',
      status: 500
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

/**
 * DELETE handler for /api/media/[id]
 * Deletes a media file
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // Check if the media file exists
    const existingMediaFile = mediaRepository.getMediaFileById(id);
    
    if (!existingMediaFile) {
      return NextResponse.json({ error: 'Media file not found' }, { status: 404 });
    }
    
    // Delete the media file
    const deleted = mediaRepository.deleteMediaFile(id);
    
    if (!deleted) {
      return NextResponse.json({ error: 'Failed to delete media file' }, { status: 500 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting media file:', error);
    
    // Return error response
    const errorResponse: ErrorResponse = {
      error: error instanceof Error ? error.message : 'An unknown error occurred',
      status: 500
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
