"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowUpDown, Trash2, FileAudio, FileImage, FileVideo, Film } from "lucide-react"
import Image from "next/image"

// Media file interface
interface MediaFile {
  id: string
  fileName: string
  name: string
  description: string
  durationInSeconds: number
  type: string
  url: string
}

// Presentation item interface
interface PresentationItem {
  id: string
  slotNumber: number
  sequenceNumber: number
  durationInSeconds: number
  mediaFile: MediaFile
}

interface PresentationItemCardProps {
  item: PresentationItem
  onSequenceChange: (itemId: string, value: number) => void
  onDurationChange: (itemId: string, value: number) => void
  onMoveItem?: (itemId: string, direction: 'up' | 'down') => void
  onDeleteItem?: (itemId: string) => void
}

// Helper function to get media type icon
const getMediaTypeIcon = (type: string) => {
  switch (type) {
    case "Audio":
      return <FileAudio className="h-5 w-5" />
    case "Video2D":
    case "Video3D":
    case "Video360":
      return <FileVideo className="h-5 w-5" />
    case "Image2D":
    case "Image3D":
    case "Image360":
      return <FileImage className="h-5 w-5" />
    default:
      return <Film className="h-5 w-5" />
  }
}

export function PresentationItemCard({
  item,
  onSequenceChange,
  onDurationChange,
  onMoveItem,
  onDeleteItem
}: PresentationItemCardProps) {
  return (
    <Card key={item.id} className="overflow-hidden">
      <div className="flex flex-col sm:flex-row">
        <div className="relative w-full sm:w-1/4 h-40 sm:h-auto bg-muted">
          <Image
            src={item.mediaFile.url || "/placeholder.svg"}
            alt={item.mediaFile.name}
            fill
            className="object-cover"
          />
          <div className="absolute top-2 left-2 bg-background/80 rounded-full p-1">
            {getMediaTypeIcon(item.mediaFile.type)}
          </div>
        </div>
        <div className="p-4 flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h5 className="font-medium">{item.mediaFile.name}</h5>
              <p className="text-sm text-muted-foreground">{item.mediaFile.description}</p>
            </div>
            <div className="flex gap-1">
              {onMoveItem && (
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => onMoveItem(item.id, 'up')}
                  title="Change sequence"
                >
                  <ArrowUpDown className="h-4 w-4" />
                </Button>
              )}
              {onDeleteItem && (
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => onDeleteItem(item.id)}
                  title="Remove item"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`sequence-${item.id}`}>Sequence Number</Label>
              <Input
                id={`sequence-${item.id}`}
                type="number"
                value={item.sequenceNumber}
                onChange={(e) => onSequenceChange(item.id, Number.parseInt(e.target.value))}
                min={1}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`duration-${item.id}`}>Duration (seconds)</Label>
              <Input
                id={`duration-${item.id}`}
                type="number"
                value={item.durationInSeconds}
                onChange={(e) => onDurationChange(item.id, Number.parseInt(e.target.value))}
                min={1}
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
