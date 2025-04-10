"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChevronLeft, ChevronRight, Trash2 } from "lucide-react"
import Image from "next/image"
import type { Clip, Presentation, Track } from "./types"
import { getMediaTypeIcon } from "./utils"

interface ClipPreviewProps {
  selectedClip: Clip | null
  presentation: Presentation
  onDurationChange: (duration: number) => void
  onMoveClip: (direction: "left" | "right") => void
  onDeleteClip: () => void
}

export function ClipPreview({
  selectedClip,
  presentation,
  onDurationChange,
  onMoveClip,
  onDeleteClip,
}: ClipPreviewProps) {
  if (!selectedClip) {
    return (
      <div className="flex items-center justify-center h-40 bg-muted/30 rounded-md">
        <p className="text-muted-foreground">Select a clip to view and edit its details</p>
      </div>
    )
  }

  const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDuration = Math.max(1, Number.parseInt(e.target.value) || 1) // Minimum 1 second
    onDurationChange(newDuration)
  }

  // Find the track containing the selected clip
  const track = presentation.tracks.find((t) => t.clips.some((c) => c.id === selectedClip.id)) as Track

  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="relative w-full md:w-1/4 aspect-square md:aspect-auto md:h-40 bg-muted rounded-md overflow-hidden">
        <Image
          src={selectedClip.mediaFile.url || "/placeholder.svg"}
          alt={selectedClip.mediaFile.name}
          fill
          className="object-cover"
        />
        <div className="absolute top-2 left-2 bg-background/80 rounded-full p-1">
          {getMediaTypeIcon(selectedClip.mediaFile.type)}
        </div>
      </div>
      <div className="flex-1 space-y-4">
        <div>
          <h3 className="text-lg font-medium">{selectedClip.mediaFile.name}</h3>
          <p className="text-sm text-muted-foreground">{selectedClip.mediaFile.description}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Type: {selectedClip.mediaFile.type} | File: {selectedClip.mediaFile.fileName}
          </p>
        </div>
        <div className="flex flex-wrap gap-4">
          <div className="space-y-2">
            <Label htmlFor="clip-duration">Duration (seconds)</Label>
            <div className="flex items-center gap-2">
              <Input
                id="clip-duration"
                type="number"
                min="1"
                value={selectedClip.durationInSeconds}
                onChange={handleDurationChange}
                className="w-20"
              />
              <span className="text-sm text-muted-foreground">seconds</span>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Position</Label>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onMoveClip("left")}
                disabled={selectedClip.sequenceNumber <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Move Left</span>
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onMoveClip("right")}
                disabled={track?.clips.length === selectedClip.sequenceNumber}
              >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Move Right</span>
              </Button>
              <Button size="sm" variant="destructive" onClick={onDeleteClip}>
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete Clip</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
