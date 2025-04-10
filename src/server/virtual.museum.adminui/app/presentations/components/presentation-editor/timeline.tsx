"use client"

import { useRef } from "react"
import { TimeRuler } from "./time-ruler"
import { Track } from "./track"
import type { Clip, Presentation } from "./types"
import { SECONDS_PER_UNIT, TRACK_LABEL_WIDTH, UNIT_WIDTH } from "./utils"

interface TimelineProps {
  presentation: Presentation
  selectedClip: Clip | null
  onClipSelect: (clip: Clip) => void
  onAddClick: (trackId: string) => void
}

export function Timeline({ presentation, selectedClip, onClipSelect, onAddClick }: TimelineProps) {
  const timelineRef = useRef<HTMLDivElement>(null)

  // Calculate the total duration of the presentation (for timeline width)
  const totalDuration = Math.max(
    ...presentation.tracks.map((track) => {
      return track.clips.reduce((sum, clip) => sum + clip.durationInSeconds, 0)
    }),
    60, // Minimum timeline width (60 seconds)
  )

  const timelineWidth = (totalDuration / SECONDS_PER_UNIT) * UNIT_WIDTH + 40 // Add padding at the end

  // Sort tracks by slot number to ensure they display in the correct order
  const sortedTracks = [...presentation.tracks].sort((a, b) => a.slotNumber - b.slotNumber)

  return (
    <div className="p-4 overflow-x-auto">
      <div ref={timelineRef} className="relative">
        <div className="flex">
          {/* Track labels column */}
          <div style={{ width: TRACK_LABEL_WIDTH, minWidth: TRACK_LABEL_WIDTH }} className="flex-shrink-0">
            {/* Empty space for the ruler */}
            <div className="h-8 border-b"></div>
          </div>

          {/* Timeline content */}
          <div style={{ width: timelineWidth }} className="flex-grow">
            {/* Time ruler */}
            <TimeRuler totalDuration={totalDuration} />
          </div>
        </div>

        {/* Tracks */}
        {sortedTracks.map((track) => (
          <Track
            key={track.id}
            track={track}
            selectedClip={selectedClip}
            onClipSelect={onClipSelect}
            onAddClick={onAddClick}
          />
        ))}
      </div>
    </div>
  )
}
