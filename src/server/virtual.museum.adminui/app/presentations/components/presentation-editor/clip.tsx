"use client"

import { cn } from "@/lib/utils"
import type { Clip as ClipType } from "./types"
import { getMediaTypeString } from "./types"
import { getClipColor, getClipWidth } from "./utils"

interface ClipProps {
  clip: ClipType
  position: number
  isSelected: boolean
  onClick: () => void
}

export function Clip({ clip, position, isSelected, onClick }: ClipProps) {
  // Ensure we have a string type for the media file
  const mediaType = typeof clip.mediaFile.type === 'number' 
    ? getMediaTypeString(clip.mediaFile.type as number)
    : clip.mediaFile.type;
  return (
    <div
      className={cn(
        "absolute top-2 bottom-2 rounded-md border cursor-pointer transition-all",
        getClipColor(mediaType),
        isSelected ? "ring-2 ring-primary ring-offset-2" : "hover:brightness-90",
      )}
      style={{
        left: position,
        width: getClipWidth(clip.durationInSeconds),
      }}
      onClick={onClick}
    >
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden p-1">
        <div className="text-xs text-white font-medium truncate">{clip.mediaFile.name}</div>
      </div>
    </div>
  )
}
