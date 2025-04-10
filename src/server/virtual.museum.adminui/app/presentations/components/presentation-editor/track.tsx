"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Clip as ClipComponent } from "./clip"
import type { Clip, Track as TrackType } from "./types"
import { getClipPosition, TRACK_LABEL_WIDTH } from "./utils"

interface TrackProps {
  track: TrackType
  selectedClip: Clip | null
  onClipSelect: (clip: Clip) => void
  onAddClick: (trackId: string) => void
}

export function Track({ track, selectedClip, onClipSelect, onAddClick }: TrackProps) {
  return (
    <div className="flex items-stretch h-16 border-b">
      {/* Track label and add button */}
      <div
        className="flex-shrink-0 flex items-center border-r"
        style={{ width: TRACK_LABEL_WIDTH, minWidth: TRACK_LABEL_WIDTH }}
      >
        <Button size="icon" variant="ghost" className="h-8 w-8 ml-1" onClick={() => onAddClick(track.id)}>
          <Plus className="h-4 w-4" />
          <span className="sr-only">Add to {track.name}</span>
        </Button>
        <div className="ml-2 text-sm font-medium">{track.name}</div>
      </div>

      {/* Clips */}
      <div className="flex-grow relative h-full">
        {track.clips.map((clip, clipIndex) => (
          <ClipComponent
            key={clip.id}
            clip={clip}
            position={getClipPosition(track, clipIndex)}
            isSelected={selectedClip?.id === clip.id}
            onClick={() => onClipSelect(clip)}
          />
        ))}
      </div>
    </div>
  )
}
