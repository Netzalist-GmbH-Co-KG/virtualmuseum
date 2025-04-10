"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Loader2 } from "lucide-react"
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
import { RoomWithRelations } from "@/lib/types"

interface RoomData {
  Id: string
  Label: string | null
  Description: string | null
  InventoryItems?: Array<{ Id: string }>
}

export default function RoomsPage() {
  const [rooms, setRooms] = useState<RoomData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newRoom, setNewRoom] = useState({
    label: "",
    description: "",
  })
  const router = useRouter()
  
  // Fetch rooms from the API
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        const response = await fetch('/api/rooms?includeInventoryItems=true')
        
        if (!response.ok) {
          throw new Error(`Error fetching rooms: ${response.status} ${response.statusText}`)
        }
        
        const data = await response.json()
        setRooms(data.rooms || [])
      } catch (err) {
        console.error('Failed to fetch rooms:', err)
        setError(err instanceof Error ? err.message : 'Failed to load rooms')
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchRooms()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewRoom((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddRoom = () => {
    // Validate form
    if (!newRoom.label.trim()) {
      return // Don't submit if label is empty
    }

    // This will be implemented in the next phase when we add write operations
    // For now, we'll just close the dialog
    setNewRoom({
      label: "",
      description: "",
    })
    setIsAddDialogOpen(false)
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Rooms</h2>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Room
        </Button>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading rooms...</span>
        </div>
      )}

      {error && (
        <div className="bg-destructive/15 text-destructive p-4 rounded-md">
          <p>Error: {error}</p>
          <Button variant="outline" className="mt-2" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      )}

      {!isLoading && !error && rooms.length === 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No rooms found. Create your first room to get started.</p>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {rooms.map((room) => (
          <Link href={`/rooms/${room.Id}`} key={room.Id}>
            <Card className="hover:bg-accent/50 transition-colors cursor-pointer h-full">
              <CardHeader>
                <CardTitle>{room.Label || 'Unnamed Room'}</CardTitle>
                <CardDescription>
                  {room.InventoryItems?.length || 0} inventory items
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{room.Description || 'No description'}</p>
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
