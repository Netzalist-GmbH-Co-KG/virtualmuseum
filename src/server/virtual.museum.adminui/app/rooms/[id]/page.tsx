"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Package, Plus, Save } from "lucide-react"
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

// Mock data for a single room
const roomData = {
  id: "1",
  label: "Main Exhibition Hall",
  description: "The primary exhibition space with the largest topographical table",
  inventoryItems: [
    {
      id: "1",
      name: "Central Topographical Table",
      description: "Large interactive table showing geographical data",
      inventoryType: "TopographicalTable",
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
    },
    {
      id: "2",
      name: "Historical Timeline Display",
      description: "Interactive timeline showing major historical events",
      inventoryType: "TopographicalTable",
      position: { x: 2, y: 0, z: 3 },
      rotation: { x: 0, y: 45, z: 0 },
      scale: { x: 0.8, y: 1, z: 0.8 },
    },
    {
      id: "3",
      name: "Media Station Alpha",
      description: "Station for viewing multimedia content",
      inventoryType: "MediaStation",
      position: { x: -3, y: 0, z: 2 },
      rotation: { x: 0, y: -30, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
    },
  ],
}

// Inventory type options
const inventoryTypeOptions = [
  { id: "TopographicalTable", name: "Topographical Table" },
  { id: "MediaStation", name: "Media Station" },
  { id: "InfoPanel", name: "Information Panel" },
]

export default function RoomDetailPage({ params }: { params: { id: string } }) {
  const [room, setRoom] = useState(roomData)
  const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false)
  const [newItem, setNewItem] = useState({
    name: "",
    description: "",
    inventoryType: "TopographicalTable",
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
    scale: { x: 1, y: 1, z: 1 },
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setRoom((prev) => ({ ...prev, [name]: value }))
  }

  const handleNewItemInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewItem((prev) => ({ ...prev, [name]: value }))
  }

  const handleNewItemTypeChange = (value: string) => {
    setNewItem((prev) => ({ ...prev, inventoryType: value }))
  }

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

  const handleAddItem = () => {
    // Validate form
    if (!newItem.name.trim()) {
      return // Don't submit if name is empty
    }

    // Create new item with generated ID
    const newItemWithId = {
      id: `${Date.now()}`, // Generate a unique ID
      ...newItem,
    }

    // Add to room's inventory items
    setRoom((prev) => ({
      ...prev,
      inventoryItems: [...prev.inventoryItems, newItemWithId],
    }))

    // Reset form and close dialog
    setNewItem({
      name: "",
      description: "",
      inventoryType: "TopographicalTable",
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      scale: { x: 1, y: 1, z: 1 },
    })
    setIsAddItemDialogOpen(false)
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center gap-2">
        <Link href="/rooms">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h2 className="text-3xl font-bold tracking-tight">{room.label}</h2>
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
                    value={room.label}
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
                    value={room.description}
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

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {room.inventoryItems.map((item) => (
              <Link href={`/inventory/${item.id}`} key={item.id}>
                <Card className="hover:bg-accent/50 transition-colors cursor-pointer h-full">
                  <CardHeader className="flex flex-row items-center gap-2">
                    <Package className="h-5 w-5" />
                    <div>
                      <CardTitle className="text-base">{item.name}</CardTitle>
                      <CardDescription>{item.inventoryType}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                    <div className="text-xs text-muted-foreground">
                      <div>
                        Position: X:{item.position.x} Y:{item.position.y} Z:{item.position.z}
                      </div>
                      <div>
                        Rotation: X:{item.rotation.x}° Y:{item.rotation.y}° Z:{item.rotation.z}°
                      </div>
                      <div>
                        Scale: X:{item.scale.x} Y:{item.scale.y} Z:{item.scale.z}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Inventory Item Dialog */}
      <Dialog open={isAddItemDialogOpen} onOpenChange={setIsAddItemDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add Inventory Item</DialogTitle>
            <DialogDescription>
              Add a new inventory item to {room.label}. The item will be automatically assigned to this room.
            </DialogDescription>
          </DialogHeader>

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
              <Select value={newItem.inventoryType} onValueChange={handleNewItemTypeChange}>
                <SelectTrigger id="item-type" className="col-span-3">
                  <SelectValue placeholder="Select item type" />
                </SelectTrigger>
                <SelectContent>
                  {inventoryTypeOptions.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
            <Button variant="outline" onClick={() => setIsAddItemDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddItem}>Add Item</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
