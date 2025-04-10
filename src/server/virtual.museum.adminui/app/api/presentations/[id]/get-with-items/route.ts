import { NextRequest, NextResponse } from 'next/server';
import { presentationRepository } from '@/lib/presentationRepository';

// Helper function to convert media type number to string
function getMediaTypeString(typeNumber: number): string {
  switch (typeNumber) {
    case 0: return 'Audio';
    case 1: return 'Video2D';
    case 2: return 'Video3D';
    case 3: return 'Video360';
    case 4: return 'Image2D';
    case 5: return 'Image3D';
    case 6: return 'Image360';
    default: return 'Unknown';
  }
}

/**
 * GET handler for retrieving a presentation with all its items and media files
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get the ID from params (must be awaited in Next.js 15+)
    const { id } = await params;

    // Get the presentation with items from the repository
    const presentation = presentationRepository.getPresentationWithItems(id);

    // If the presentation doesn't exist, return a 404
    if (!presentation) {
      return NextResponse.json({ error: 'Presentation not found' }, { status: 404 });
    }

    // Transform the data to match the frontend model
    const transformedPresentation = {
      id: presentation.Id,
      name: presentation.Name || '',
      description: presentation.Description || '',
      presentationItems: presentation.PresentationItems.map(item => ({
        id: item.Id,
        slotNumber: item.SlotNumber,
        sequenceNumber: item.SequenceNumber,
        durationInSeconds: item.DurationInSeconds,
        mediaFile: {
          id: item.MediaFile.Id,
          fileName: item.MediaFile.FileName || '',
          name: item.MediaFile.Name || '',
          description: item.MediaFile.Description || '',
          durationInSeconds: item.MediaFile.DurationInSeconds,
          type: getMediaTypeString(item.MediaFile.Type),
          url: item.MediaFile.Url || '/placeholder.svg'
        }
      }))
    };

    return NextResponse.json(transformedPresentation);
  } catch (error) {
    console.error('Error fetching presentation with items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch presentation details' },
      { status: 500 }
    );
  }
}
