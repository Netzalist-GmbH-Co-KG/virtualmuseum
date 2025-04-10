"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"

// Mock data for rooms
const initialRooms = [
  {
    id: "1",
    label: "Main Exhibition Hall",
    description: "The primary exhibition space with the largest topographical table",
    inventoryItemsCount: 3,
  },
  {
    id: "2",
    label: "Historical Gallery",
    description: "Dedicated to historical events and timelines",
    inventoryItemsCount: 2,
  },
  {
    id: "3",
    label: "Science Wing",
    description: "Interactive exhibits focusing on scientific discoveries",
    inventoryItemsCount: 4,
  },
  {
    id: "4",
    label: "Cultural Showcase",
    description: "Displays cultural artifacts and developments",
    inventoryItemsCount: 2,
  },
  {
    id: "5",
    label: "Innovation Space",
    description: "Modern innovations and future technologies",
    inventoryItemsCount: 1,
  },
]

export default function RoomsPage() {
  const [rooms, setRooms] = useState(initialRooms)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newRoom, setNewRoom] = useState({
    label: "",
    description: "",
  })
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewRoom((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddRoom = () => {
    // Validate form
    if (!newRoom.label.trim()) {
      return // Don't submit if label is empty
    }

    // Create new room with generated ID
    const newRoomWithId = {
      id: `${Date.now()}`, // Generate a unique ID
      label: newRoom.label,
      description: newRoom.description,
      inventoryItemsCount: 0,
    }

    // Add to rooms list
    setRooms((prev) => [...prev, newRoomWithId])

    // Reset form and close dialog
    setNewRoom({
      label: "",
      description: "",
    })
    setIsAddDialogOpen(false)

    // Optionally navigate to the new room
    // router.push(`/rooms/${newRoomWithId.id}`)
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Rooms</h2>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Room
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {rooms.map((room) => (
          <Link href={`/rooms/${room.id}`} key={room.id}>
            <Card className="hover:bg-accent/50 transition-colors cursor-pointer h-full">
              <CardHeader>
                <CardTitle>{room.label}</CardTitle>
                <CardDescription>{room.inventoryItemsCount} inventory items</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{room.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Add Room Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Room</DialogTitle>
            <DialogDescription>Create a new room in the museum</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="room-label" className="text-right">
                Label
              </Label>
              <Input
                id="room-label"
                name="label"
                value={newRoom.label}
                onChange={handleInputChange}
                placeholder="Enter room name"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="room-description" className="text-right">
                Description
              </Label>
              <Textarea
                id="room-description"
                name="description"
                value={newRoom.description}
                onChange={handleInputChange}
                placeholder="Enter room description"
                className="col-span-3"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddRoom}>Create Room</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
