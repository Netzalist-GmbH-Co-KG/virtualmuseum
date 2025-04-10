import { NextRequest, NextResponse } from 'next/server';
import { presentationRepository } from '@/lib/presentationRepository';
import { mediaRepository } from '@/lib/mediaRepository';
import { ErrorResponse } from '@/lib/types';

/**
 * GET handler for /api/presentations/[id]
 * Retrieves a single multimedia presentation by ID with its items
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    
    // Get the presentation
    const presentation = presentationRepository.getPresentationById(id);
    
    if (!presentation) {
      return NextResponse.json({ error: 'Presentation not found' }, { status: 404 });
    }
    
    // Get the presentation items
    const presentationItems = presentationRepository.getPresentationItems(id);
    
    // Get media files for the items
    const mediaFileIds = presentationItems
      .filter(item => item.MediaFileId)
      .map(item => item.MediaFileId as string);
    
    const mediaFiles = mediaFileIds.length > 0 
      ? mediaFileIds.map(mediaId => mediaRepository.getMediaFileById(mediaId)).filter(Boolean)
      : [];
    
    // Map media types to string representations
    const mediaTypeMap: Record<number, string> = {
      0: 'Image2D',
      1: 'Image3D',
      2: 'Image360',
      3: 'Video2D',
      4: 'Video3D',
      5: 'Video360',
      6: 'Audio'
    };
    
    // Format the items with media information
    const formattedItems = presentationItems.map(item => {
      const mediaFile = item.MediaFileId 
        ? mediaFiles.find(m => m?.Id === item.MediaFileId) 
        : null;
      
      return {
        id: item.Id,
        slotNumber: item.SlotNumber,
        sequenceNumber: item.SequenceNumber,
        durationInSeconds: item.DurationInSeconds,
        mediaFile: mediaFile ? {
          id: mediaFile.Id,
          name: mediaFile.Name || '',
          description: mediaFile.Description || '',
          type: mediaTypeMap[mediaFile.Type] || 'Unknown',
          url: mediaFile.Url || '',
          durationInSeconds: mediaFile.DurationInSeconds
        } : null
      };
    });
    
    // Format the response
    const formattedPresentation = {
      id: presentation.Id,
      name: presentation.Name || '',
      description: presentation.Description || '',
      items: formattedItems
    };
    
    return NextResponse.json(formattedPresentation);
  } catch (error) {
    console.error('Error fetching presentation:', error);
    
    // Return error response
    const errorResponse: ErrorResponse = {
      error: error instanceof Error ? error.message : 'An unknown error occurred',
      status: 500
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

/**
 * PUT handler for /api/presentations/[id]
 * Updates a multimedia presentation
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    
    // Check if the presentation exists
    const existingPresentation = presentationRepository.getPresentationById(id);
    if (!existingPresentation) {
      return NextResponse.json({ error: 'Presentation not found' }, { status: 404 });
    }
    
    // Parse the request body
    const data = await request.json();
    
    // Update the presentation
    const updatedPresentation = presentationRepository.updatePresentation(id, {
      Name: data.name !== undefined ? data.name : undefined,
      Description: data.description !== undefined ? data.description : undefined
    });
    
    // Format the response
    const formattedPresentation = {
      id: updatedPresentation.Id,
      name: updatedPresentation.Name || '',
      description: updatedPresentation.Description || ''
    };
    
    return NextResponse.json(formattedPresentation);
  } catch (error) {
    console.error('Error updating presentation:', error);
    
    // Return error response
    const errorResponse: ErrorResponse = {
      error: error instanceof Error ? error.message : 'An unknown error occurred',
      status: 500
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

/**
 * DELETE handler for /api/presentations/[id]
 * Deletes a multimedia presentation
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    
    // Check if the presentation exists
    const existingPresentation = presentationRepository.getPresentationById(id);
    if (!existingPresentation) {
      return NextResponse.json({ error: 'Presentation not found' }, { status: 404 });
    }
    
    // Delete the presentation
    const deleted = presentationRepository.deletePresentation(id);
    
    if (!deleted) {
      return NextResponse.json({ error: 'Failed to delete presentation' }, { status: 500 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting presentation:', error);
    
    // Return error response
    const errorResponse: ErrorResponse = {
      error: error instanceof Error ? error.message : 'An unknown error occurred',
      status: 500
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
