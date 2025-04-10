"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react"
import { PresentationItemCard } from "./PresentationItemCard"

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

interface PresentationItemsSectionProps {
  presentationItems: PresentationItem[]
  onSequenceChange: (itemId: string, value: number) => void
  onDurationChange: (itemId: string, value: number) => void
  onAddItem?: () => void
  onMoveItem?: (itemId: string, direction: 'up' | 'down') => void
  onDeleteItem?: (itemId: string) => void
}

// Helper function to get slot name
const getSlotName = (slotNumber: number) => {
  switch (slotNumber) {
    case 0:
      return "Audio Only"
    case 1:
      return "360° Dome"
    default:
      return `Display ${slotNumber}`
  }
}

export function PresentationItemsSection({
  presentationItems,
  onSequenceChange,
  onDurationChange,
  onAddItem,
  onMoveItem,
  onDeleteItem
}: PresentationItemsSectionProps) {
  return (
    <>
      <div className="flex justify-between">
        <h3 className="text-lg font-medium">Presentation Items</h3>
        {onAddItem && (
          <Button onClick={onAddItem}>
            <Plus className="mr-2 h-4 w-4" /> Add Item
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Presentation Sequence</CardTitle>
          <CardDescription>Manage the media items in this presentation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {[0, 1, 2, 3].map((slotNumber) => {
              const slotItems = presentationItems
                .filter((item) => item.slotNumber === slotNumber)
                .sort((a, b) => a.sequenceNumber - b.sequenceNumber)

              if (slotItems.length === 0) return null

              return (
                <div key={slotNumber} className="space-y-2">
                  <h4 className="font-medium">
                    Slot {slotNumber}: {getSlotName(slotNumber)}
                  </h4>
                  <div className="space-y-2">
                    {slotItems.map((item) => (
                      <PresentationItemCard
                        key={item.id}
                        item={item}
                        onSequenceChange={onSequenceChange}
                        onDurationChange={onDurationChange}
                        onMoveItem={onMoveItem}
                        onDeleteItem={onDeleteItem}
                      />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </>
  )
}
