"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"
import { AddMediaDialog } from "./add-media-dialog"
import { ClipPreview } from "./clip-preview"
import { Timeline } from "./timeline"
import type { Clip, MediaFile, Presentation, Track } from "./types"
import { getTrackName } from "./utils"
import { Plus, Trash2 } from "lucide-react"

interface TimelineEditorProps {
  presentation: Presentation
  availableMediaFiles: MediaFile[]
  onPresentationChange: (presentation: Presentation) => void
}

export function TimelineEditor({ presentation, availableMediaFiles, onPresentationChange }: TimelineEditorProps) {
  const [selectedClip, setSelectedClip] = useState<Clip | null>(null)
  const [isAddMediaDialogOpen, setIsAddMediaDialogOpen] = useState(false)
  const [selectedTrackId, setSelectedTrackId] = useState<string | null>(null)

  const handleClipDurationChange = (newDuration: number) => {
    if (!selectedClip) return

    // Update the selected clip state
    setSelectedClip((prev) => {
      if (!prev) return null
      return { ...prev, durationInSeconds: newDuration }
    })

    // Update the clip in the presentation
    const updatedPresentation = {
      ...presentation,
      tracks: presentation.tracks.map((track) => ({
        ...track,
        clips: track.clips.map((clip) =>
          clip.id === selectedClip.id ? { ...clip, durationInSeconds: newDuration } : clip,
        ),
      })),
    }

    onPresentationChange(updatedPresentation)
  }

  const handleMoveClip = (direction: "left" | "right") => {
    if (!selectedClip) return

    // Find the track that contains the selected clip
    const trackIndex = presentation.tracks.findIndex((track) => track.clips.some((clip) => clip.id === selectedClip.id))

    if (trackIndex === -1) return

    const track = presentation.tracks[trackIndex]
    const clipIndex = track.clips.findIndex((clip) => clip.id === selectedClip.id)

    // Can't move left if it's the first clip
    if (direction === "left" && clipIndex === 0) return

    // Can't move right if it's the last clip
    if (direction === "right" && clipIndex === track.clips.length - 1) return

    // Create a new array of clips with the selected clip moved
    const newClips = [...track.clips]
    const targetIndex = direction === "left" ? clipIndex - 1 : clipIndex + 1

    // Swap the clips
    ;[newClips[clipIndex], newClips[targetIndex]] = [newClips[targetIndex], newClips[clipIndex]]

    // Update sequence numbers
    newClips.forEach((clip, index) => {
      clip.sequenceNumber = index + 1
    })

    // Update the track with the new clips array
    const newTracks = [...presentation.tracks]
    newTracks[trackIndex] = { ...track, clips: newClips }

    const updatedPresentation = { ...presentation, tracks: newTracks }
    onPresentationChange(updatedPresentation)
  }

  const handleDeleteClip = () => {
    if (!selectedClip) return

    // Find the track that contains the selected clip
    const trackIndex = presentation.tracks.findIndex((track) => track.clips.some((clip) => clip.id === selectedClip.id))

    if (trackIndex === -1) return

    const track = presentation.tracks[trackIndex]

    // Filter out the selected clip
    const newClips = track.clips.filter((clip) => clip.id !== selectedClip.id)

    // Update sequence numbers
    newClips.forEach((clip, index) => {
      clip.sequenceNumber = index + 1
    })

    // Update the track with the new clips array
    const newTracks = [...presentation.tracks]
    newTracks[trackIndex] = { ...track, clips: newClips }

    const updatedPresentation = { ...presentation, tracks: newTracks }
    onPresentationChange(updatedPresentation)

    // Clear the selected clip
    setSelectedClip(null)
  }

  const handleAddClip = (trackId: string, mediaFileId: string) => {
    const track = presentation.tracks.find((t) => t.id === trackId)
    if (!track) return

    const mediaFile = availableMediaFiles.find((m) => m.id === mediaFileId)
    if (!mediaFile) return

    // Create a new clip
    const newClip: Clip = {
      id: `clip-${Date.now()}`,
      sequenceNumber: track.clips.length + 1,
      durationInSeconds: mediaFile.durationInSeconds || 5, // Default to 5 seconds for images
      mediaFile,
    }

    // Add the clip to the track
    const updatedPresentation = {
      ...presentation,
      tracks: presentation.tracks.map((t) => {
        if (t.id === trackId) {
          return {
            ...t,
            clips: [...t.clips, newClip],
          }
        }
        return t
      }),
    }

    onPresentationChange(updatedPresentation)

    // Close the dialog
    setIsAddMediaDialogOpen(false)
    setSelectedTrackId(null)
  }

  const handleAddClick = (trackId: string) => {
    setSelectedTrackId(trackId)
    setIsAddMediaDialogOpen(true)
  }

  // Function to add a new track
  const handleAddTrack = () => {
    // Find the highest slot number
    const highestSlotNumber = Math.max(...presentation.tracks.map((track) => track.slotNumber), 0)

    // Create a new track with the next slot number
    const newTrack: Track = {
      id: `track-${Date.now()}`,
      name: getTrackName(highestSlotNumber + 1),
      slotNumber: highestSlotNumber + 1,
      clips: [],
    }

    // Add the new track to the presentation
    const updatedPresentation = {
      ...presentation,
      tracks: [...presentation.tracks, newTrack],
    }

    onPresentationChange(updatedPresentation)
  }

  // Function to delete trailing empty tracks
  const handleDeleteEmptyTracks = () => {
    // Find which tracks have clips
    const tracksWithClips = new Set<number>()
    presentation.tracks.forEach((track) => {
      if (track.clips.length > 0) {
        tracksWithClips.add(track.slotNumber)
      }
    })

    // Find the highest slot number with clips
    const highestSlotWithClips = Math.max(...Array.from(tracksWithClips), 0)

    // Filter out empty tracks with slot numbers higher than the highest slot with clips
    const filteredTracks = presentation.tracks.filter(
      (track) => track.clips.length > 0 || track.slotNumber <= highestSlotWithClips,
    )

    // Only update if we actually removed tracks
    if (filteredTracks.length < presentation.tracks.length) {
      const updatedPresentation = {
        ...presentation,
        tracks: filteredTracks,
      }

      onPresentationChange(updatedPresentation)
    }
  }

  // Check if there are any trailing empty tracks that can be deleted
  const hasTrailingEmptyTracks = () => {
    // Find which tracks have clips
    const tracksWithClips = new Set<number>()
    presentation.tracks.forEach((track) => {
      if (track.clips.length > 0) {
        tracksWithClips.add(track.slotNumber)
      }
    })

    // Find the highest slot number with clips
    const highestSlotWithClips = Math.max(...Array.from(tracksWithClips), 0)

    // Check if there are empty tracks with slot numbers higher than the highest slot with clips
    return presentation.tracks.some((track) => track.clips.length === 0 && track.slotNumber > highestSlotWithClips)
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Timeline Editor</CardTitle>
          <CardDescription>Arrange media clips in the timeline to create your presentation</CardDescription>
        </div>
        <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
          <Button size="sm" onClick={handleAddTrack}>
            <Plus className="mr-2 h-4 w-4" /> Add Track
          </Button>
          <Button size="sm" variant="outline" onClick={handleDeleteEmptyTracks} disabled={!hasTrailingEmptyTracks()}>
            <Trash2 className="mr-2 h-4 w-4" /> Remove Empty Tracks
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {/* Selected Clip Preview */}
        <div className="border-b p-4">
          <ClipPreview
            selectedClip={selectedClip}
            presentation={presentation}
            onDurationChange={handleClipDurationChange}
            onMoveClip={handleMoveClip}
            onDeleteClip={handleDeleteClip}
          />
        </div>

        {/* Timeline */}
        <Timeline
          presentation={presentation}
          selectedClip={selectedClip}
          onClipSelect={setSelectedClip}
          onAddClick={handleAddClick}
        />

        {/* Add Media Dialog */}
        <AddMediaDialog
          isOpen={isAddMediaDialogOpen}
          onOpenChange={setIsAddMediaDialogOpen}
          selectedTrackId={selectedTrackId}
          presentation={presentation}
          availableMediaFiles={availableMediaFiles}
          onAddClip={handleAddClip}
        />
      </CardContent>
    </Card>
  )
}
