// Import the main types from the parent directory
import { MediaFile as AppMediaFile, PresentationItem, Presentation as AppPresentation } from "../../types"

// Enum for media file types that matches the database integer values
export enum MediaFileType {
  Audio = 0,
  Video2D = 1,
  Video3D = 2,
  Video360 = 3,
  Image2D = 4,
  Image3D = 5,
  Image360 = 6
}

// Helper function to convert numeric media type to string representation
export const getMediaTypeString = (typeValue: number): string => {
  switch (typeValue) {
    case MediaFileType.Audio:
      return "Audio"
    case MediaFileType.Video2D:
      return "Video2D"
    case MediaFileType.Video3D:
      return "Video3D"
    case MediaFileType.Video360:
      return "Video360"
    case MediaFileType.Image2D:
      return "Image2D"
    case MediaFileType.Image3D:
      return "Image3D"
    case MediaFileType.Image360:
      return "Image360"
    default:
      return "Unknown"
  }
}

// Re-export the MediaFile type from the main types
export type MediaFile = AppMediaFile;

// Clip is equivalent to PresentationItem in the main types
export type Clip = PresentationItem;

// Track is a grouping of PresentationItems by slotNumber
export type Track = {
  id: string
  name: string
  slotNumber: number
  clips: Clip[]
}

// Editor-specific Presentation type that includes tracks
export type Presentation = {
  id: string
  name: string
  description: string
  tracks: Track[]
}

// Helper functions to convert between the two presentation formats
export function convertAppPresentationToEditorPresentation(appPresentation: AppPresentation): Presentation {
  // Group presentation items by slot number
  const trackMap = new Map<number, Track>();
  
  // Create default tracks for slots 0-3
  const defaultTracks: Track[] = [
    { id: "track-0", name: "Audio Track", slotNumber: 0, clips: [] },
    { id: "track-1", name: "360° Dome", slotNumber: 1, clips: [] },
    { id: "track-2", name: "Display 2", slotNumber: 2, clips: [] },
    { id: "track-3", name: "Display 3", slotNumber: 3, clips: [] }
  ];
  
  // Initialize the track map with default tracks
  defaultTracks.forEach(track => {
    trackMap.set(track.slotNumber, { ...track, clips: [] });
  });
  
  // Group presentation items by slot number
  appPresentation.presentationItems.forEach(item => {
    const slotNumber = item.slotNumber;
    
    if (!trackMap.has(slotNumber)) {
      // Create a new track if it doesn't exist
      trackMap.set(slotNumber, {
        id: `track-${slotNumber}`,
        name: `Track ${slotNumber}`,
        slotNumber,
        clips: []
      });
    }
    
    // Add the item to the appropriate track
    const track = trackMap.get(slotNumber)!;
    
    // Create a copy of the item with properly converted media file type
    const itemWithProperType = {
      ...item,
      mediaFile: {
        ...item.mediaFile,
        // Ensure the type is a string for UI rendering
        type: typeof item.mediaFile.type === 'number' 
          ? getMediaTypeString(item.mediaFile.type as number)
          : item.mediaFile.type
      }
    };
    
    track.clips.push(itemWithProperType);
  });
  
  // Sort clips within each track by sequence number
  trackMap.forEach(track => {
    track.clips.sort((a, b) => a.sequenceNumber - b.sequenceNumber);
  });
  
  // Convert the map to an array of tracks
  const tracks = Array.from(trackMap.values());
  
  return {
    id: appPresentation.id,
    name: appPresentation.name,
    description: appPresentation.description,
    tracks
  };
}

export function convertEditorPresentationToAppPresentation(editorPresentation: Presentation): AppPresentation {
  // Flatten all clips from all tracks into a single array of presentation items
  const presentationItems: PresentationItem[] = [];
  
  editorPresentation.tracks.forEach(track => {
    track.clips.forEach(clip => {
      presentationItems.push({
        ...clip,
        slotNumber: track.slotNumber
      });
    });
  });
  
  return {
    id: editorPresentation.id,
    name: editorPresentation.name,
    description: editorPresentation.description,
    presentationItems
  };
}