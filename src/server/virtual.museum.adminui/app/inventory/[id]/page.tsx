"use client"

import React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

// Import our new components
import {
  BreadcrumbNav,
  ItemDetailsTab,
  PositionScaleTab,
  TopicsTab,
  AddTopicDialog,
  LinkTimeSeriesDialog
} from "./components"

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
      {/* Breadcrumb Navigation */}
      <BreadcrumbNav 
        roomId={inventoryItem.roomId} 
        roomName={inventoryItem.roomName} 
        itemName={inventoryItem.name} 
      />

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
          <ItemDetailsTab 
            inventoryItem={inventoryItem}
            handleInputChange={handleInputChange}
            setInventoryItem={setInventoryItem}
          />
        </TabsContent>

        <TabsContent value="position" className="space-y-4">
          <PositionScaleTab 
            inventoryItem={inventoryItem}
            handlePositionChange={handlePositionChange}
            handleRotationChange={handleRotationChange}
            handleScaleChange={handleScaleChange}
          />
        </TabsContent>

        {inventoryItem.inventoryType === "TopographicalTable" && (
          <TabsContent value="topics" className="space-y-4">
            <TopicsTab 
              inventoryItem={inventoryItem}
              handleTopicChange={handleTopicChange}
              setIsAddTopicDialogOpen={setIsAddTopicDialogOpen}
              openLinkTimeSeriesDialog={openLinkTimeSeriesDialog}
            />
          </TabsContent>
        )}
      </Tabs>

      {/* Dialogs */}
      <AddTopicDialog 
        isOpen={isAddTopicDialogOpen}
        setIsOpen={setIsAddTopicDialogOpen}
        newTopic={newTopic}
        handleNewTopicChange={handleNewTopicChange}
        handleAddTopic={handleAddTopic}
      />

      <LinkTimeSeriesDialog 
        isOpen={isLinkTimeSeriesDialogOpen}
        setIsOpen={setIsLinkTimeSeriesDialogOpen}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedTimeSeries={selectedTimeSeries}
        handleTimeSeriesCheckboxChange={handleTimeSeriesCheckboxChange}
        handleLinkTimeSeries={handleLinkTimeSeries}
        filteredTimeSeries={filteredTimeSeries}
      />
    </div>
  )
}