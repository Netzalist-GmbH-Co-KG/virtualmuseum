// Import the main types from the parent directory
import { MediaFile as AppMediaFile, PresentationItem, Presentation as AppPresentation } from "../../types"
import { getTrackName } from "./utils"

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
// We need to store the highest track number to preserve empty tracks
let highestTrackSlotNumber = 2; // Start with the default 3 tracks (0-2)

export function convertAppPresentationToEditorPresentation(appPresentation: AppPresentation): Presentation {
  
  // Group presentation items by slot number
  const trackMap = new Map<number, Track>();
  
  // Create default tracks for slots 0-2
  const defaultTracks: Track[] = [
    { id: "track-0", name: "Audio Track", slotNumber: 0, clips: [] },
    { id: "track-1", name: "360° Dome", slotNumber: 1, clips: [] },
    { id: "track-2", name: "Display 2", slotNumber: 2, clips: [] }
  ];
  
  // Initialize the track map with default tracks
  defaultTracks.forEach(track => {
    trackMap.set(track.slotNumber, { ...track, clips: [] });
  });
  
  // Add tracks for all slots up to the highest known slot number
  // This ensures we preserve empty tracks that were added previously
  for (let i = 3; i <= highestTrackSlotNumber; i++) {
    trackMap.set(i, {
      id: `track-${i}`,
      name: getTrackName(i),
      slotNumber: i,
      clips: []
    });
  }
  
  // Group presentation items by slot number
  appPresentation.presentationItems.forEach(item => {
    const slotNumber = item.slotNumber;
    
    if (!trackMap.has(slotNumber)) {
      // Create a new track if it doesn't exist
      const newTrack = {
        id: `track-${slotNumber}`,
        name: getTrackName(slotNumber),
        slotNumber,
        clips: []
      };
      trackMap.set(slotNumber, newTrack);
      
      // Update the highest slot number if needed
      if (slotNumber > highestTrackSlotNumber) {
        highestTrackSlotNumber = slotNumber;
      }
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
  
  // Convert the map to an array of tracks and sort by slot number
  const tracks = Array.from(trackMap.values())
    .sort((a, b) => a.slotNumber - b.slotNumber);
  
  return {
    id: appPresentation.id,
    name: appPresentation.name,
    description: appPresentation.description,
    tracks
  };
}

export function convertEditorPresentationToAppPresentation(editorPresentation: Presentation): AppPresentation {
  
  // Update the highest track slot number based on the current tracks
  if (editorPresentation.tracks.length > 0) {
    const maxSlot = Math.max(...editorPresentation.tracks.map(t => t.slotNumber));
    // Always update the highest track number to match what's in the editor
    // This ensures removed tracks stay removed
    highestTrackSlotNumber = maxSlot;
  } else {
    // If there are no tracks, reset to the default
    highestTrackSlotNumber = 2;
  }
  
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