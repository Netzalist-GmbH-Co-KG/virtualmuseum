import { NextRequest, NextResponse } from 'next/server';
import { presentationRepository } from '@/lib/presentationRepository';
import { mediaRepository } from '@/lib/mediaRepository';
import { ErrorResponse } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

/**
 * PUT handler for /api/presentations/[id]/update-with-items
 * Updates a multimedia presentation with all its items
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
    
    // Update the presentation metadata
    const updatedPresentation = presentationRepository.updatePresentation(id, {
      Name: data.name !== undefined ? data.name : undefined,
      Description: data.description !== undefined ? data.description : undefined
    });
    
    // Get existing presentation items to determine what needs to be deleted
    const existingItems = presentationRepository.getPresentationItems(id);
    const existingItemIds = new Set(existingItems.map(item => item.Id));
    
    // Track which items we're keeping
    const keepItemIds = new Set<string>();
    
    // Process the new presentation items
    if (Array.isArray(data.presentationItems)) {
      // Group items by slot number for sequence numbering
      const itemsBySlot = new Map<number, any[]>();
      
      data.presentationItems.forEach((item: any) => {
        const slotNumber = item.slotNumber;
        if (!itemsBySlot.has(slotNumber)) {
          itemsBySlot.set(slotNumber, []);
        }
        itemsBySlot.get(slotNumber)!.push(item);
      });
      
      // Process each slot
      for (const [slotNumber, items] of itemsBySlot.entries()) {
        // Sort items by their position in the array (implicit sequence)
        items.sort((a: any, b: any) => {
          // If items have a sequenceNumber, use it
          if (a.sequenceNumber !== undefined && b.sequenceNumber !== undefined) {
            return a.sequenceNumber - b.sequenceNumber;
          }
          // Otherwise, use their original order
          return 0;
        });
        
        // Update or create each item with proper sequence numbers
        items.forEach((item: any, index: number) => {
          // Check if the item has a valid mediaFileId
          if (!item.mediaFile?.id) {
            return; // Skip items without a media file
          }
          
          // Verify the media file exists
          const mediaFile = mediaRepository.getMediaFileById(item.mediaFile.id);
          if (!mediaFile) {
            console.warn(`Media file with ID ${item.mediaFile.id} not found, skipping item`);
            return;
          }
          
          // If the item has an ID and it exists in the database, update it
          if (item.id && existingItemIds.has(item.id)) {
            presentationRepository.updatePresentationItem(item.id, {
              MediaFileId: item.mediaFile.id,
              SlotNumber: slotNumber,
              SequenceNumber: index,
              DurationInSeconds: item.durationInSeconds || mediaFile.DurationInSeconds || 0
            });
            
            // Mark this item as kept
            keepItemIds.add(item.id);
          } else {
            // Otherwise, create a new item
            presentationRepository.addPresentationItem({
              MultimediaPresentationId: id,
              MediaFileId: item.mediaFile.id,
              SlotNumber: slotNumber,
              SequenceNumber: index,
              DurationInSeconds: item.durationInSeconds || mediaFile.DurationInSeconds || 0
            });
          }
        });
      }
    }
    
    // Delete items that are no longer in the presentation
    for (const itemId of existingItemIds) {
      if (!keepItemIds.has(itemId)) {
        presentationRepository.deletePresentationItem(itemId);
      }
    }
    
    // Get the updated presentation with items
    const updatedPresentationWithItems = presentationRepository.getPresentationWithItems(id);
    
    // Map media types to string representations for the response
    const mediaTypeMap: Record<number, string> = {
      0: 'Image2D',
      1: 'Image3D',
      2: 'Image360',
      3: 'Video2D',
      4: 'Video3D',
      5: 'Video360',
      6: 'Audio'
    };
    
    // Format the response
    const formattedPresentation = {
      id: updatedPresentation.Id,
      name: updatedPresentation.Name || '',
      description: updatedPresentation.Description || '',
      presentationItems: updatedPresentationWithItems?.PresentationItems.map(item => ({
        id: item.Id,
        slotNumber: item.SlotNumber,
        sequenceNumber: item.SequenceNumber,
        durationInSeconds: item.DurationInSeconds,
        mediaFile: {
          id: item.MediaFile.Id,
          name: item.MediaFile.Name || '',
          description: item.MediaFile.Description || '',
          type: mediaTypeMap[item.MediaFile.Type] || 'Unknown',
          url: item.MediaFile.Url || '',
          durationInSeconds: item.MediaFile.DurationInSeconds
        }
      })) || []
    };
    
    return NextResponse.json(formattedPresentation);
  } catch (error) {
    console.error('Error updating presentation with items:', error);
    
    // Return error response
    const errorResponse: ErrorResponse = {
      error: error instanceof Error ? error.message : 'An unknown error occurred',
      status: 500
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
