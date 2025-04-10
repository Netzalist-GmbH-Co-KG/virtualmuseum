"use client"

import React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Clock, Save, Trash2, DoorOpen, Home, Plus, Search, ImageIcon } from "lucide-react"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"

// Mock data for a single inventory item (topographical table)
const inventoryItemData = {
  id: "1",
  name: "Central Topographical Table",
  description: "Large interactive table showing geographical data",
  inventoryType: "TopographicalTable",
  roomId: "1",
  roomName: "Main Exhibition Hall",
  position: { x: 0, y: 0, z: 0 },
  rotation: { x: 0, y: 0, z: 0 },
  scale: { x: 1, y: 1, z: 1 },
  // Topographical table specific data
  topographicalTable: {
    id: "1",
    topics: [
      {
        id: "1",
        topic: "World War II",
        description: "Major events and battles of World War II",
        mediaFileImage2DId: "img1",
        mediaFileImage2DUrl: "/placeholder.svg?height=100&width=100",
        timeSeries: [
          {
            id: "1",
            name: "World War II Timeline",
            description: "Major events during World War II (1939-1945)",
            geoEventGroupsCount: 5,
            geoEventsCount: 18,
          },
        ],
      },
      {
        id: "2",
        topic: "Industrial Revolution",
        description: "Key developments during the Industrial Revolution",
        mediaFileImage2DId: "img2",
        mediaFileImage2DUrl: "/placeholder.svg?height=100&width=100",
        timeSeries: [
          {
            id: "2",
            name: "Industrial Revolution",
            description: "Key developments during the Industrial Revolution (1760-1840)",
            geoEventGroupsCount: 3,
            geoEventsCount: 12,
          },
        ],
      },
    ],
  },
  // Options for dropdowns
  roomOptions: [
    { id: "1", name: "Main Exhibition Hall" },
    { id: "2", name: "Historical Gallery" },
    { id: "3", name: "Science Wing" },
    { id: "4", name: "Cultural Showcase" },
    { id: "5", name: "Innovation Space" },
  ],
  inventoryTypeOptions: [
    { id: "TopographicalTable", name: "Topographical Table" },
    { id: "MediaStation", name: "Media Station" },
    { id: "InfoPanel", name: "Information Panel" },
  ],
}

// Mock data for available time series
const availableTimeSeries = [
  {
    id: "1",
    name: "World War II Timeline",
    description: "Major events during World War II (1939-1945)",
    geoEventGroupsCount: 5,
    geoEventsCount: 18,
  },
  {
    id: "2",
    name: "Industrial Revolution",
    description: "Key developments during the Industrial Revolution (1760-1840)",
    geoEventGroupsCount: 3,
    geoEventsCount: 12,
  },
  {
    id: "3",
    name: "Space Exploration",
    description: "Major milestones in human space exploration (1957-Present)",
    geoEventGroupsCount: 4,
    geoEventsCount: 15,
  },
  {
    id: "4",
    name: "Ancient Civilizations",
    description: "Rise and fall of major ancient civilizations",
    geoEventGroupsCount: 6,
    geoEventsCount: 24,
  },
  {
    id: "5",
    name: "Climate Change",
    description: "Significant climate events and policy developments",
    geoEventGroupsCount: 3,
    geoEventsCount: 9,
  },
]

export default function InventoryItemDetailPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  // Unwrap params with React.use()
  const unwrappedParams = 'then' in params ? React.use(params) : params;
  const [inventoryItem, setInventoryItem] = useState(inventoryItemData)
  const [isAddTopicDialogOpen, setIsAddTopicDialogOpen] = useState(false)
  const [isLinkTimeSeriesDialogOpen, setIsLinkTimeSeriesDialogOpen] = useState(false)
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTimeSeries, setSelectedTimeSeries] = useState<string[]>([])

  // New topic state
  const [newTopic, setNewTopic] = useState({
    topic: "",
    description: "",
    mediaFileImage2DId: "",
    mediaFileImage2DUrl: "/placeholder.svg?height=100&width=100",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setInventoryItem((prev) => ({ ...prev, [name]: value }))
  }

  const handlePositionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const axis = name.split(".")[1] // Extract x, y, or z
    setInventoryItem((prev) => ({
      ...prev,
      position: {
        ...prev.position,
        [axis]: Number.parseFloat(value),
      },
    }))
  }

  const handleRotationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const axis = name.split(".")[1] // Extract x, y, or z
    setInventoryItem((prev) => ({
      ...prev,
      rotation: {
        ...prev.rotation,
        [axis]: Number.parseFloat(value),
      },
    }))
  }

  const handleScaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const axis = name.split(".")[1] // Extract x, y, or z
    setInventoryItem((prev) => ({
      ...prev,
      scale: {
        ...prev.scale,
        [axis]: Number.parseFloat(value),
      },
    }))
  }

  const handleNewTopicChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewTopic((prev) => ({ ...prev, [name]: value }))
  }

  const handleTopicChange = (topicId: string, field: string, value: string) => {
    setInventoryItem((prev) => ({
      ...prev,
      topographicalTable: {
        ...prev.topographicalTable,
        topics: prev.topographicalTable.topics.map((topic) => {
          if (topic.id === topicId) {
            return {
              ...topic,
              [field]: value,
            }
          }
          return topic
        }),
      },
    }))
  }

  const handleAddTopic = () => {
    // Validate form
    if (!newTopic.topic.trim()) {
      return // Don't submit if topic name is empty
    }

    // Create new topic with generated ID
    const newTopicWithId = {
      id: `topic-${Date.now()}`,
      ...newTopic,
      timeSeries: [],
    }

    // Add to inventory item's topics
    setInventoryItem((prev) => ({
      ...prev,
      topographicalTable: {
        ...prev.topographicalTable,
        topics: [...prev.topographicalTable.topics, newTopicWithId],
      },
    }))

    // Reset form and close dialog
    setNewTopic({
      topic: "",
      description: "",
      mediaFileImage2DId: "",
      mediaFileImage2DUrl: "/placeholder.svg?height=100&width=100",
    })
    setIsAddTopicDialogOpen(false)
  }

  const openLinkTimeSeriesDialog = (topicId: string) => {
    setSelectedTopicId(topicId)
    setSelectedTimeSeries([])
    setIsLinkTimeSeriesDialogOpen(true)
  }

  const handleTimeSeriesCheckboxChange = (timeSeriesId: string) => {
    setSelectedTimeSeries((prev) => {
      if (prev.includes(timeSeriesId)) {
        return prev.filter((id) => id !== timeSeriesId)
      } else {
        return [...prev, timeSeriesId]
      }
    })
  }

  const handleLinkTimeSeries = () => {
    if (!selectedTopicId || selectedTimeSeries.length === 0) return

    // Find the selected time series objects
    const timeSeriesObjects = availableTimeSeries.filter((series) => selectedTimeSeries.includes(series.id))

    // Update the inventory item with the linked time series
    setInventoryItem((prev) => ({
      ...prev,
      topographicalTable: {
        ...prev.topographicalTable,
        topics: prev.topographicalTable.topics.map((topic) => {
          if (topic.id === selectedTopicId) {
            // Filter out any time series that are already linked
            const existingIds = topic.timeSeries.map((series) => series.id)
            const newTimeSeries = timeSeriesObjects.filter((series) => !existingIds.includes(series.id))

            return {
              ...topic,
              timeSeries: [...topic.timeSeries, ...newTimeSeries],
            }
          }
          return topic
        }),
      },
    }))

    // Close dialog and reset state
    setIsLinkTimeSeriesDialogOpen(false)
    setSelectedTopicId(null)
    setSelectedTimeSeries([])
  }

  // Filter time series based on search term
  const filteredTimeSeries = availableTimeSeries.filter((series) => {
    return (
      series.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      series.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">
              <Home className="h-4 w-4 mr-2" />
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/rooms">
              <DoorOpen className="h-4 w-4 mr-2" />
              Rooms
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/rooms/${inventoryItem.roomId}`}>{inventoryItem.roomName}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>{inventoryItem.name}</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center gap-2">
        <Link href={`/rooms/${inventoryItem.roomId}`}>
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h2 className="text-3xl font-bold tracking-tight">{inventoryItem.name}</h2>
      </div>

      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">Item Details</TabsTrigger>
          <TabsTrigger value="position">Position & Scale</TabsTrigger>
          {inventoryItem.inventoryType === "TopographicalTable" && (
            <TabsTrigger value="topics">Topics & Time Series</TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Item Information</CardTitle>
              <CardDescription>Edit the details of this inventory item</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={inventoryItem.name}
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
                    value={inventoryItem.description}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="inventoryType" className="text-right">
                    Item Type
                  </Label>
                  <Select
                    value={inventoryItem.inventoryType}
                    onValueChange={(value) => setInventoryItem((prev) => ({ ...prev, inventoryType: value }))}
                  >
                    <SelectTrigger id="inventoryType" className="col-span-3">
                      <SelectValue placeholder="Select item type" />
                    </SelectTrigger>
                    <SelectContent>
                      {inventoryItem.inventoryTypeOptions.map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                          {option.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="room" className="text-right">
                    Room
                  </Label>
                  <Select
                    value={inventoryItem.roomId}
                    onValueChange={(value) => setInventoryItem((prev) => ({ ...prev, roomId: value }))}
                  >
                    <SelectTrigger id="room" className="col-span-3">
                      <SelectValue placeholder="Select room" />
                    </SelectTrigger>
                    <SelectContent>
                      {inventoryItem.roomOptions.map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                          {option.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button className="w-full sm:w-auto">
                <Save className="mr-2 h-4 w-4" /> Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="position" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Position, Rotation & Scale</CardTitle>
              <CardDescription>Configure the spatial properties of this item</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Position</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="position.x">X Position</Label>
                      <Input
                        id="position.x"
                        name="position.x"
                        type="number"
                        step="0.1"
                        value={inventoryItem.position.x}
                        onChange={handlePositionChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="position.y">Y Position</Label>
                      <Input
                        id="position.y"
                        name="position.y"
                        type="number"
                        step="0.1"
                        value={inventoryItem.position.y}
                        onChange={handlePositionChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="position.z">Z Position</Label>
                      <Input
                        id="position.z"
                        name="position.z"
                        type="number"
                        step="0.1"
                        value={inventoryItem.position.z}
                        onChange={handlePositionChange}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Rotation (degrees)</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="rotation.x">X Rotation</Label>
                      <Input
                        id="rotation.x"
                        name="rotation.x"
                        type="number"
                        step="1"
                        value={inventoryItem.rotation.x}
                        onChange={handleRotationChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rotation.y">Y Rotation</Label>
                      <Input
                        id="rotation.y"
                        name="rotation.y"
                        type="number"
                        step="1"
                        value={inventoryItem.rotation.y}
                        onChange={handleRotationChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rotation.z">Z Rotation</Label>
                      <Input
                        id="rotation.z"
                        name="rotation.z"
                        type="number"
                        step="1"
                        value={inventoryItem.rotation.z}
                        onChange={handleRotationChange}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Scale</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="scale.x">X Scale</Label>
                      <Input
                        id="scale.x"
                        name="scale.x"
                        type="number"
                        step="0.1"
                        min="0.1"
                        value={inventoryItem.scale.x}
                        onChange={handleScaleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="scale.y">Y Scale</Label>
                      <Input
                        id="scale.y"
                        name="scale.y"
                        type="number"
                        step="0.1"
                        min="0.1"
                        value={inventoryItem.scale.y}
                        onChange={handleScaleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="scale.z">Z Scale</Label>
                      <Input
                        id="scale.z"
                        name="scale.z"
                        type="number"
                        step="0.1"
                        min="0.1"
                        value={inventoryItem.scale.z}
                        onChange={handleScaleChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <Button className="w-full sm:w-auto">
                <Save className="mr-2 h-4 w-4" /> Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {inventoryItem.inventoryType === "TopographicalTable" && (
          <TabsContent value="topics" className="space-y-4">
            <div className="flex justify-between">
              <h3 className="text-lg font-medium">Topographical Table Topics</h3>
              <Button onClick={() => setIsAddTopicDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> Add Topic
              </Button>
            </div>

            <Accordion type="multiple" className="w-full">
              {inventoryItem.topographicalTable.topics.map((topic) => (
                <AccordionItem value={topic.id} key={topic.id}>
                  <AccordionTrigger className="hover:bg-accent/50 px-4 rounded-md">
                    <div className="flex items-center justify-between w-full pr-4">
                      <div className="font-medium">{topic.topic}</div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{topic.timeSeries.length} time series</span>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="p-4 space-y-4">
                      <div className="grid gap-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor={`topic-${topic.id}`} className="text-right">
                            Topic Name
                          </Label>
                          <Input
                            id={`topic-${topic.id}`}
                            value={topic.topic}
                            onChange={(e) => handleTopicChange(topic.id, "topic", e.target.value)}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label htmlFor={`description-${topic.id}`} className="text-right">
                            Description
                          </Label>
                          <Textarea
                            id={`description-${topic.id}`}
                            value={topic.description}
                            onChange={(e) => handleTopicChange(topic.id, "description", e.target.value)}
                            className="col-span-3"
                          />
                        </div>
                        <div className="grid grid-cols-4 items-start gap-4">
                          <Label className="text-right pt-2">Topic Image</Label>
                          <div className="col-span-3 flex items-center gap-4">
                            <div className="relative w-24 h-24 border rounded-md overflow-hidden">
                              <img
                                src={topic.mediaFileImage2DUrl || "/placeholder.svg"}
                                alt={topic.topic}
                                className="object-cover w-full h-full"
                              />
                            </div>
                            <Button variant="outline">Change Image</Button>
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-medium">Time Series</h4>
                          <Button size="sm" onClick={() => openLinkTimeSeriesDialog(topic.id)}>
                            <Clock className="mr-2 h-4 w-4" /> Link Time Series
                          </Button>
                        </div>

                        <div className="space-y-2">
                          {topic.timeSeries.map((series) => (
                            <Link href={`/time-series/${series.id}`} key={series.id}>
                              <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
                                <CardContent className="p-4">
                                  <div className="space-y-1">
                                    <div className="font-medium">{series.name}</div>
                                    <div className="text-sm text-muted-foreground">{series.description}</div>
                                    <div className="text-xs text-muted-foreground">
                                      {series.geoEventGroupsCount} groups, {series.geoEventsCount} events
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </Link>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-end gap-2">
                        <Button variant="destructive" size="sm">
                          <Trash2 className="mr-2 h-4 w-4" /> Delete Topic
                        </Button>
                        <Button size="sm">
                          <Save className="mr-2 h-4 w-4" /> Save Topic
                        </Button>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </TabsContent>
        )}
      </Tabs>

      {/* Add Topic Dialog */}
      <Dialog open={isAddTopicDialogOpen} onOpenChange={setIsAddTopicDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Topic</DialogTitle>
            <DialogDescription>
              Create a new topic for this topographical table. You can link time series to it after creation.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="topic-name" className="text-right">
                Topic Name
              </Label>
              <Input
                id="topic-name"
                name="topic"
                value={newTopic.topic}
                onChange={handleNewTopicChange}
                placeholder="Enter topic name"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="topic-description" className="text-right">
                Description
              </Label>
              <Textarea
                id="topic-description"
                name="description"
                value={newTopic.description}
                onChange={handleNewTopicChange}
                placeholder="Enter topic description"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <Label className="text-right pt-2">Topic Image</Label>
              <div className="col-span-3">
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative w-24 h-24 border rounded-md overflow-hidden bg-muted">
                    <img
                      src={newTopic.mediaFileImage2DUrl || "/placeholder.svg"}
                      alt="Topic preview"
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <Button variant="outline">
                    <ImageIcon className="mr-2 h-4 w-4" /> Select Image
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  Select an image from the media library to represent this topic.
                </p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddTopicDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddTopic}>Create Topic</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Link Time Series Dialog */}
      <Dialog open={isLinkTimeSeriesDialogOpen} onOpenChange={setIsLinkTimeSeriesDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Link Time Series</DialogTitle>
            <DialogDescription>
              Select time series to link to this topic. You can select multiple time series.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="flex items-center gap-2 border rounded-md px-3 py-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search time series..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
            </div>

            <ScrollArea className="h-[300px] rounded-md border p-4">
              <div className="space-y-4">
                {filteredTimeSeries.length > 0 ? (
                  filteredTimeSeries.map((series) => (
                    <div key={series.id} className="flex items-start space-x-3 py-2">
                      <Checkbox
                        id={`timeseries-${series.id}`}
                        checked={selectedTimeSeries.includes(series.id)}
                        onCheckedChange={() => handleTimeSeriesCheckboxChange(series.id)}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <label
                          htmlFor={`timeseries-${series.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {series.name}
                        </label>
                        <p className="text-sm text-muted-foreground">{series.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {series.geoEventGroupsCount} groups, {series.geoEventsCount} events
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-muted-foreground">No time series found</div>
                )}
              </div>
            </ScrollArea>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsLinkTimeSeriesDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleLinkTimeSeries} disabled={selectedTimeSeries.length === 0}>
              Link Selected Time Series
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
