import React from 'react'
import { FileAudio, FileImage, FileVideo, Film } from "lucide-react"
import { Track } from './types'

// Constants for timeline
export const SECONDS_PER_UNIT = 5 // Each unit in the timeline represents 5 seconds
export const UNIT_WIDTH = 50 // Width in pixels of each unit
export const TRACK_LABEL_WIDTH = 160 // Width for track labels

// Helper function to get media type icon
export const getMediaTypeIcon = (type: string) => {
  switch (type) {
    case "Audio":
      return <FileAudio className="h-5 w-5" />
    case "Video2D":
    case "Video360":
      return <FileVideo className="h-5 w-5" />
    case "Image2D":
    case "Image360":
      return <FileImage className="h-5 w-5" />
    default:
      return <Film className="h-5 w-5" />
  }
}

// Helper function to get track name
export const getTrackName = (slotNumber: number) => {
  switch (slotNumber) {
    case 0:
      return "Audio Track"
    case 1:
      return "360° Dome"
    default:
      return `Display ${slotNumber}`
  }
}

// Helper function to get clip color based on media type
export const getClipColor = (type: string) => {
  switch (type) {
    case "Audio":
      return "bg-purple-500"
    case "Video2D":
      return "bg-green-500"
    case "Video360":
      return "bg-orange-500"
    case "Image2D":
      return "bg-blue-500"
    case "Image360":
      return "bg-pink-500"
    default:
      return "bg-gray-500"
  }
}

// Function to get the position of a clip in the timeline
export const getClipPosition = (track: Track, clipIndex: number) => {
  let position = 0

  // Sum the durations of all clips before this one
  for (let i = 0; i < clipIndex; i++) {
    position += track.clips[i].durationInSeconds
  }

  // Convert to pixels
  return (position / SECONDS_PER_UNIT) * UNIT_WIDTH
}

// Function to get the width of a clip in the timeline
export const getClipWidth = (durationInSeconds: number) => {
  return (durationInSeconds / SECONDS_PER_UNIT) * UNIT_WIDTH
}
