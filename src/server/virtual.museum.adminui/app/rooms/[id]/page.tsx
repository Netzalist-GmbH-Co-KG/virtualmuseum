"use client"

import React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Package, Plus, Save, Loader2 } from "lucide-react"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { InventoryItem } from "@/lib/types"

// Currently only supporting Topographical Tables
const TOPOGRAPHICAL_TABLE_TYPE = 1;

// Map inventory type enum to display names
const inventoryTypeNames: Record<number, string> = {
  0: "Topographical Table"
}

interface RoomData {
  Id: string
  Label: string | null
  Description: string | null
  InventoryItems?: InventoryItemData[]
}

interface InventoryItemData {
  Id: string
  Name: string | null
  Description: string | null
  InventoryType: number
  PositionX: number
  PositionY: number
  PositionZ: number
  RotationX: number
  RotationY: number
  RotationZ: number
  ScaleX: number
  ScaleY: number
  ScaleZ: number
}

export default function RoomDetailPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  // Unwrap params with React.use()
  const unwrappedParams = 'then' in params ? React.use(params) : params;
  const [room, setRoom] = useState<RoomData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false)
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 },
  })
  
  // Fetch room data from API
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        const response = await fetch(`/api/rooms/${unwrappedParams.id}?includeInventoryItems=true`)
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error(`Room with ID ${unwrappedParams.id} not found`)
          }
          throw new Error(`Error fetching room: ${response.status} ${response.statusText}`)
        }
        
        const data = await response.json()
        setRoom(data.room)
      } catch (err) {
        console.error('Failed to fetch room:', err)
        setError(err instanceof Error ? err.message : 'Failed to load room')
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchRoom()
  }, [unwrappedParams.id])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!room) return
    
    const { name, value } = e.target
    // Convert the name to match our API field names (e.g., label -> Label)
    const fieldName = name.charAt(0).toUpperCase() + name.slice(1)
    setRoom((prev) => prev ? { ...prev, [fieldName]: value } : null)
    
    // Note: Update logic will be implemented later
  }

  const handleNewItemInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewItem((prev) => ({ ...prev, [name]: value }))
  }

  // Removed handleNewItemTypeChange as we only support Topographical Tables

  const handlePositionChange = (axis: string, value: string) => {
    setNewItem((prev) => ({
      ...prev,
      position: {
        ...prev.position,
        [axis]: Number.parseFloat(value) || 0,
      },
    }))
  }

  const handleRotationChange = (axis: string, value: string) => {
    setNewItem((prev) => ({
      ...prev,
      rotation: {
        ...prev.rotation,
        [axis]: Number.parseFloat(value) || 0,
      },
    }))
  }

  const handleScaleChange = (axis: string, value: string) => {
    setNewItem((prev) => ({
      ...prev,
      scale: {
        ...prev.scale,
        [axis]: Number.parseFloat(value) || 1,
      },
    }))
  }

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const handleAddItem = async () => {
    // Validate form
    if (!newItem.name.trim() || !room) {
      return // Don't submit if name is empty or room is not loaded
    }

    try {
      setIsSubmitting(true)
      setSubmitError(null)
      
      // Prepare data for API request
      const requestData = {
        name: newItem.name,
        description: newItem.description,
        position: newItem.position,
        rotation: newItem.rotation,
        scale: newItem.scale
      }
      
      // Send request to create inventory item with topographical table
      const response = await fetch(`/api/rooms/${unwrappedParams.id}/inventory/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create inventory item')
      }
      
      // Get the response data
      const data = await response.json()
      
      // Update the room's inventory items list
      if (room.InventoryItems) {
        setRoom({
          ...room,
          InventoryItems: [
            ...room.InventoryItems,
            {
              Id: data.inventoryItem.Id,
              Name: data.inventoryItem.Name,
              Description: data.inventoryItem.Description,
              InventoryType: data.inventoryItem.InventoryType,
              PositionX: data.inventoryItem.PositionX,
              PositionY: data.inventoryItem.PositionY,
              PositionZ: data.inventoryItem.PositionZ,
              RotationX: data.inventoryItem.RotationX,
              RotationY: data.inventoryItem.RotationY,
              RotationZ: data.inventoryItem.RotationZ,
              ScaleX: data.inventoryItem.ScaleX,
              ScaleY: data.inventoryItem.ScaleY,
              ScaleZ: data.inventoryItem.ScaleZ
            }
          ]
        })
      } else {
        setRoom({
          ...room,
          InventoryItems: [{
            Id: data.inventoryItem.Id,
            Name: data.inventoryItem.Name,
            Description: data.inventoryItem.Description,
            InventoryType: data.inventoryItem.InventoryType,
            PositionX: data.inventoryItem.PositionX,
            PositionY: data.inventoryItem.PositionY,
            PositionZ: data.inventoryItem.PositionZ,
            RotationX: data.inventoryItem.RotationX,
            RotationY: data.inventoryItem.RotationY,
            RotationZ: data.inventoryItem.RotationZ,
            ScaleX: data.inventoryItem.ScaleX,
            ScaleY: data.inventoryItem.ScaleY,
            ScaleZ: data.inventoryItem.ScaleZ
          }]
        })
      }
      
      // Reset form and close dialog
      setNewItem({
        name: "",
        description: "",
        position: { x: 0, y: 0, z: 0 },
        rotation: { x: 0, y: 0, z: 0 },
        scale: { x: 1, y: 1, z: 1 },
      })
      setIsAddItemDialogOpen(false)
    } catch (error) {
      console.error('Failed to create inventory item:', error)
      setSubmitError(error instanceof Error ? error.message : 'Failed to create inventory item')
    } finally {
      setIsSubmitting(false)
    }
  }

  // If loading, show loading state
  if (isLoading) {
    return (
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center gap-2">
          <Link href="/rooms">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h2 className="text-3xl font-bold tracking-tight">Loading...</h2>
        </div>
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading room details...</span>
        </div>
      </div>
    )
  }
  
  // If error, show error state
  if (error || !room) {
    return (
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center gap-2">
          <Link href="/rooms">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h2 className="text-3xl font-bold tracking-tight">Error</h2>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Error Loading Room</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-destructive">{error || 'Room not found'}</p>
            <Button className="mt-4" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }
  
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center gap-2">
        <Link href="/rooms">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h2 className="text-3xl font-bold tracking-tight">{room.Label || 'Unnamed Room'}</h2>
      </div>

      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">Room Details</TabsTrigger>
          <TabsTrigger value="inventory">Inventory Items</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Room Information</CardTitle>
              <CardDescription>Edit the details of this room</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="label" className="text-right">
                    Label
                  </Label>
                  <Input
                    id="label"
                    name="label"
                    value={room.Label || ''}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={room.Description || ''}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
              </div>
              <Button className="w-full sm:w-auto">
                <Save className="mr-2 h-4 w-4" /> Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4">
          <div className="flex justify-between">
            <h3 className="text-lg font-medium">Inventory Items</h3>
            <Button onClick={() => setIsAddItemDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Item
            </Button>
          </div>
          
          {!room.InventoryItems || room.InventoryItems.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No inventory items found. Add your first item to get started.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {room.InventoryItems.map((item) => (
                <Link href={`/inventory/${item.Id}`} key={item.Id}>
                  <Card className="hover:bg-accent/50 transition-colors cursor-pointer h-full">
                    <CardHeader className="flex flex-row items-center gap-2">
                      <Package className="h-5 w-5" />
                      <div>
                        <CardTitle className="text-base">{item.Name || 'Unnamed Item'}</CardTitle>
                        <CardDescription>{inventoryTypeNames[item.InventoryType] || 'Unknown Type'}</CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-2">{item.Description || 'No description'}</p>
                      <div className="text-xs text-muted-foreground">
                        <div>
                          Position: X:{item.PositionX.toFixed(2)} Y:{item.PositionY.toFixed(2)} Z:{item.PositionZ.toFixed(2)}
                        </div>
                        <div>
                          Rotation: X:{item.RotationX.toFixed(2)}° Y:{item.RotationY.toFixed(2)}° Z:{item.RotationZ.toFixed(2)}°
                        </div>
                        <div>
                          Scale: X:{item.ScaleX.toFixed(2)} Y:{item.ScaleY.toFixed(2)} Z:{item.ScaleZ.toFixed(2)}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Add Inventory Item Dialog */}
      <Dialog open={isAddItemDialogOpen} onOpenChange={(open) => {
        // Only allow closing if not submitting
        if (!isSubmitting) {
          setIsAddItemDialogOpen(open)
          if (!open) {
            setSubmitError(null)
          }
        }
      }}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add Inventory Item</DialogTitle>
            <DialogDescription>
              Add a new inventory item to {room.Label || 'this room'}. The item will be automatically assigned to this room.
            </DialogDescription>
          </DialogHeader>
          
          {submitError && (
            <div className="bg-destructive/15 text-destructive p-3 rounded-md mb-4">
              <p className="text-sm">Error: {submitError}</p>
            </div>
          )}

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="item-name" className="text-right">
                Name
              </Label>
              <Input
                id="item-name"
                name="name"
                value={newItem.name}
                onChange={handleNewItemInputChange}
                placeholder="Enter item name"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="item-description" className="text-right">
                Description
              </Label>
              <Textarea
                id="item-description"
                name="description"
                value={newItem.description}
                onChange={handleNewItemInputChange}
                placeholder="Enter item description"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="item-type" className="text-right">
                Item Type
              </Label>
              <div className="col-span-3 flex items-center">
                <span className="text-muted-foreground">Topographical Table</span>
                <span className="ml-2 rounded-full bg-primary/10 px-2 py-1 text-xs text-primary">Default</span>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-medium mb-4">Position, Rotation & Scale</h4>

              <div className="space-y-4">
                <div>
                  <h5 className="text-sm font-medium mb-2">Position</h5>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="position-x">X Position</Label>
                      <Input
                        id="position-x"
                        type="number"
                        step="0.1"
                        value={newItem.position.x}
                        onChange={(e) => handlePositionChange("x", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="position-y">Y Position</Label>
                      <Input
                        id="position-y"
                        type="number"
                        step="0.1"
                        value={newItem.position.y}
                        onChange={(e) => handlePositionChange("y", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="position-z">Z Position</Label>
                      <Input
                        id="position-z"
                        type="number"
                        step="0.1"
                        value={newItem.position.z}
                        onChange={(e) => handlePositionChange("z", e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="text-sm font-medium mb-2">Rotation (degrees)</h5>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="rotation-x">X Rotation</Label>
                      <Input
                        id="rotation-x"
                        type="number"
                        step="1"
                        value={newItem.rotation.x}
                        onChange={(e) => handleRotationChange("x", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rotation-y">Y Rotation</Label>
                      <Input
                        id="rotation-y"
                        type="number"
                        step="1"
                        value={newItem.rotation.y}
                        onChange={(e) => handleRotationChange("y", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rotation-z">Z Rotation</Label>
                      <Input
                        id="rotation-z"
                        type="number"
                        step="1"
                        value={newItem.rotation.z}
                        onChange={(e) => handleRotationChange("z", e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="text-sm font-medium mb-2">Scale</h5>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="scale-x">X Scale</Label>
                      <Input
                        id="scale-x"
                        type="number"
                        step="0.1"
                        min="0.1"
                        value={newItem.scale.x}
                        onChange={(e) => handleScaleChange("x", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="scale-y">Y Scale</Label>
                      <Input
                        id="scale-y"
                        type="number"
                        step="0.1"
                        min="0.1"
                        value={newItem.scale.y}
                        onChange={(e) => handleScaleChange("y", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="scale-z">Z Scale</Label>
                      <Input
                        id="scale-z"
                        type="number"
                        step="0.1"
                        min="0.1"
                        value={newItem.scale.z}
                        onChange={(e) => handleScaleChange("z", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddItemDialogOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleAddItem} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Add Item'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
