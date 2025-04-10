"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import type { MediaFile, Presentation } from "./types"
import { getMediaTypeIcon } from "./utils"

interface AddMediaDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  selectedTrackId: string | null
  presentation: Presentation
  availableMediaFiles: MediaFile[]
  onAddClip: (trackId: string, mediaFileId: string) => void
}

export function AddMediaDialog({
  isOpen,
  onOpenChange,
  selectedTrackId,
  presentation,
  availableMediaFiles,
  onAddClip,
}: AddMediaDialogProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const selectedTrack = presentation.tracks.find((t) => t.id === selectedTrackId)
  
  // Filter function that checks if a media file matches the search term
  const matchesSearchTerm = (file: MediaFile) => {
    if (!searchTerm.trim()) return true
    
    const term = searchTerm.toLowerCase()
    return (
      (file.name && file.name.toLowerCase().includes(term)) ||
      (file.description && file.description.toLowerCase().includes(term))
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Media to Track</DialogTitle>
          <DialogDescription>Select a media file to add to the {selectedTrack?.name || "track"}</DialogDescription>
          <div className="relative mt-4">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or description..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </DialogHeader>

        <ScrollArea className="h-[400px] rounded-md border p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableMediaFiles
              .filter((file) => {
                // Filter media files based on track type
                if (!selectedTrack) return false

                // Audio track (slot 0) only accepts audio files
                if (selectedTrack.slotNumber === 0) return file.type === "Audio"

                // 360° Dome (slot 1) only accepts 360° media
                if (selectedTrack.slotNumber === 1) return file.type === "Image360" || file.type === "Video360"

                // Other displays accept 2D media
                return file.type === "Image2D" || file.type === "Video2D"
              })
              // Apply search term filter
              .filter(matchesSearchTerm)
              .map((file) => (
                <Card
                  key={file.id}
                  className="overflow-hidden cursor-pointer hover:bg-accent/50 transition-colors"
                  onClick={() => onAddClip(selectedTrackId!, file.id)}
                >
                  <div className="relative aspect-video bg-muted">
                    <Image src={file.url || "/placeholder.svg"} alt={file.name} fill className="object-cover" />
                    <div className="absolute top-2 left-2 bg-background/80 rounded-full p-1">
                      {getMediaTypeIcon(file.type)}
                    </div>
                  </div>
                  <CardContent className="p-3">
                    <div className="font-medium truncate">{file.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {file.type} | {file.durationInSeconds > 0 ? `${file.durationInSeconds}s` : "Static"}
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
