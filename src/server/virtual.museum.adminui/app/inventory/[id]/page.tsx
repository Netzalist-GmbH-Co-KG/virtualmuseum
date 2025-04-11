"use client"

import React from "react"
import { useState, useEffect } from "react"
import { InventoryItem, ApiInventoryResponse, Option } from "./components/types"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Trash2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "@/components/ui/use-toast"

// Import our new components
import {
  BreadcrumbNav,
  ItemDetailsTab,
  PositionScaleTab,
  TopicsTab,
  AddTopicDialog,
  LinkTimeSeriesDialog
} from "./components"

// Inventory type options
const inventoryTypeOptions = [
  { id: "0", name: "Topographical Table" }
]

// Type definition for time series data
interface TimeSeries {
  id: string;
  name: string;
  description: string;
  geoEventGroupsCount: number;
  geoEventsCount: number;
}

// Default empty inventory item structure
const emptyInventoryItem: InventoryItem = {
  id: "",
  name: "",
  description: "",
  inventoryType: "0",
  roomId: "",
  roomName: "",
  position: { x: 0, y: 0, z: 0 },
  rotation: { x: 0, y: 0, z: 0 },
  scale: { x: 1, y: 1, z: 1 },
  topographicalTable: {
    id: "",
    topics: [],
  },
  roomOptions: [],
  inventoryTypeOptions: inventoryTypeOptions,
}

export default function InventoryItemDetailPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  // Unwrap params with React.use()
  const unwrappedParams = 'then' in params ? React.use(params) : params;
  
  // State for inventory item and UI
  const [inventoryItem, setInventoryItem] = useState<InventoryItem>(emptyInventoryItem)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [roomOptions, setRoomOptions] = useState<Option[]>([])
  
  // State for saving
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = useState(false)
  
  // State for dialogs
  const [isAddTopicDialogOpen, setIsAddTopicDialogOpen] = useState(false)
  const [isLinkTimeSeriesDialogOpen, setIsLinkTimeSeriesDialogOpen] = useState(false)
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTimeSeries, setSelectedTimeSeries] = useState<string[]>([])
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [availableTimeSeries, setAvailableTimeSeries] = useState<TimeSeries[]>([])
  const [isLinkingTimeSeries, setIsLinkingTimeSeries] = useState(false)
  const [isUnlinkingTimeSeries, setIsUnlinkingTimeSeries] = useState(false)
  const router = useRouter()

  // New topic state
  const [newTopic, setNewTopic] = useState({
    topic: "",
    description: "",
    mediaFileImage2DId: "",
    mediaFileImage2DUrl: "/placeholder.svg?height=100&width=100",
  })
  
  // Function to save inventory item changes
  const handleSaveChanges = async () => {
    setIsSaving(true)
    setSaveError(null)
    setSaveSuccess(false)
    
    try {
      // Prepare the data for the API
      const itemData = {
        id: inventoryItem.id,
        name: inventoryItem.name,
        description: inventoryItem.description,
        inventoryType: parseInt(inventoryItem.inventoryType),
        roomId: inventoryItem.roomId,
        position: inventoryItem.position,
        rotation: inventoryItem.rotation,
        scale: inventoryItem.scale
      }
      
      // Send the update request
      const response = await fetch(`/api/inventory/${inventoryItem.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemData),
      })
      
      if (!response.ok) {
        throw new Error(`Error saving inventory item: ${response.status} ${response.statusText}`)
      }
      
      // Show success message
      setSaveSuccess(true)
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false)
      }, 3000)
    } catch (err) {
      console.error('Error saving inventory item:', err)
      setSaveError(err instanceof Error ? err.message : 'Unknown error occurred')
    } finally {
      setIsSaving(false)
    }
  }
  
  // Function to save topic changes
  const handleSaveTopics = async (topicId: string) => {
    setIsSaving(true)
    setSaveError(null)
    setSaveSuccess(false)
    
    try {
      // Find the topic to save
      const topic = inventoryItem.topographicalTable.topics.find(t => t.id === topicId)
      
      if (!topic) {
        throw new Error('Topic not found')
      }
      
      // Prepare the data for the API
      const topicData = {
        id: topic.id,
        topic: topic.topic,
        description: topic.description,
        mediaFileImage2DId: topic.mediaFileImage2DId,
        topographicalTableId: inventoryItem.topographicalTable.id
      }
      
      // Send the update request
      const response = await fetch(`/api/topics/${topic.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(topicData),
      })
      
      if (!response.ok) {
        throw new Error(`Error saving topic: ${response.status} ${response.statusText}`)
      }
      
      // Show success message
      setSaveSuccess(true)
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false)
      }, 3000)
    } catch (err) {
      console.error('Error saving topic:', err)
      setSaveError(err instanceof Error ? err.message : 'Unknown error occurred')
    } finally {
      setIsSaving(false)
    }
  }

  // Fetch inventory item data from API
  useEffect(() => {
    const fetchInventoryItem = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        // Fetch inventory item data
        const response = await fetch(`/api/inventory/${unwrappedParams.id}`)
        
        if (!response.ok) {
          throw new Error(`Failed to fetch inventory item: ${response.statusText}`)
        }
        
        const data = await response.json()
        
        // Convert the API response to our InventoryItem type
        const item: InventoryItem = {
          id: data.inventoryItem.Id,
          name: data.inventoryItem.Name || '',
          description: data.inventoryItem.Description || '',
          inventoryType: data.inventoryItem.InventoryType.toString(),
          roomId: data.inventoryItem.RoomId,
          roomName: data.room ? data.room.Name : 'Unknown Room',
          position: {
            x: data.inventoryItem.PositionX,
            y: data.inventoryItem.PositionY,
            z: data.inventoryItem.PositionZ
          },
          rotation: {
            x: data.inventoryItem.RotationX,
            y: data.inventoryItem.RotationY,
            z: data.inventoryItem.RotationZ
          },
          scale: {
            x: data.inventoryItem.ScaleX,
            y: data.inventoryItem.ScaleY,
            z: data.inventoryItem.ScaleZ
          },
          topographicalTable: {
            id: data.topographicalTable ? data.topographicalTable.Id : '',
            topics: data.topics ? data.topics.map((topic: any) => ({
              id: topic.Id,
              topic: topic.Topic || '',
              description: topic.Description || '',
              mediaFileImage2DId: topic.MediaFileImage2DId,
              mediaFileImage2DUrl: topic.MediaFileImage2DId ? `/api/media/file/${topic.MediaFileImage2DId}` : '/placeholder.svg?height=100&width=100',
              timeSeries: topic.TimeSeries ? topic.TimeSeries.map((ts: any) => ({
                id: ts.Id,
                name: ts.Name || '',
                description: ts.Description || '',
                geoEventGroupsCount: ts.GeoEventGroupsCount || 0,
                geoEventsCount: ts.GeoEventsCount || 0
              })) : []
            })) : []
          },
          roomOptions: [],
          inventoryTypeOptions
        }
        
        setInventoryItem(item)
      } catch (err) {
        console.error('Error fetching inventory item:', err)
        setError(err instanceof Error ? err.message : 'Failed to load inventory item')
      } finally {
        setIsLoading(false)
      }
    }
    
    const fetchRooms = async () => {
      try {
        const response = await fetch('/api/rooms')
        
        if (response.ok) {
          const data = await response.json()
          
          const options = data.rooms.map((room: any) => ({
            id: room.Id,
            name: room.Name
          }))
          
          setRoomOptions(options)
        }
      } catch (err) {
        console.error('Failed to fetch rooms:', err)
      }
    }
    
    fetchInventoryItem()
    fetchRooms()
  }, [unwrappedParams.id])
  
  // Fetch available time series when component mounts
  useEffect(() => {
    const fetchTimeSeries = async () => {
      try {
        const response = await fetch('/api/time-series')
        
        if (!response.ok) {
          throw new Error(`Failed to fetch time series: ${response.statusText}`)
        }
        
        const data = await response.json()
        
        if (data.timeSeries && Array.isArray(data.timeSeries)) {
          setAvailableTimeSeries(data.timeSeries)
        }
      } catch (err) {
        console.error('Error fetching time series:', err)
        toast({
          title: "Error",
          description: "Failed to load time series data",
          variant: "destructive"
        })
      }
    }
    
    fetchTimeSeries()
  }, [])

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
    setInventoryItem((prev) => {
      // Create a deep copy of the previous state
      const updatedItem = { ...prev }
      
      // Update the topics array
      updatedItem.topographicalTable = {
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
      }
      
      return updatedItem
    })
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
    setInventoryItem((prev) => {
      // Create a deep copy of the previous state
      const updatedItem = { ...prev }
      
      // Update the topics array
      updatedItem.topographicalTable = {
        ...prev.topographicalTable,
        topics: [...prev.topographicalTable.topics, newTopicWithId],
      }
      
      return updatedItem
    })

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

  const handleLinkTimeSeries = async () => {
    if (!selectedTopicId || selectedTimeSeries.length === 0) return

    setIsLinkingTimeSeries(true)
    
    try {
      // Send the request to link time series to the topic
      const response = await fetch(`/api/topics/${selectedTopicId}/link-time-series`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          timeSeriesIds: selectedTimeSeries
        }),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Failed to link time series: ${response.statusText}`)
      }
      
      // Find the selected time series objects
      const timeSeriesObjects = availableTimeSeries.filter((series) => selectedTimeSeries.includes(series.id))

      // Update the inventory item with the linked time series
      setInventoryItem((prev) => {
        // Create a deep copy of the previous state
        const updatedItem = { ...prev }
        
        // Update the topics array with the linked time series
        updatedItem.topographicalTable = {
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
        }
        
        return updatedItem
      })

      // Show success message
      toast({
        title: "Success",
        description: "Time series linked successfully",
      })
    } catch (err) {
      console.error('Error linking time series:', err)
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to link time series",
        variant: "destructive"
      })
    } finally {
      setIsLinkingTimeSeries(false)
      
      // Close dialog and reset state
      setIsLinkTimeSeriesDialogOpen(false)
      setSelectedTopicId(null)
      setSelectedTimeSeries([])
    }
  }

  // Function to handle unlinking a time series from a topic
  const handleUnlinkTimeSeries = async (topicId: string, timeSeriesId: string) => {
    setIsUnlinkingTimeSeries(true)
    
    try {
      // Send the request to unlink the time series from the topic
      const response = await fetch(`/api/topics/${topicId}/unlink-time-series`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          timeSeriesId
        }),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Failed to unlink time series: ${response.statusText}`)
      }
      
      // Update the inventory item by removing the unlinked time series
      setInventoryItem((prev) => {
        // Create a deep copy of the previous state
        const updatedItem = { ...prev }
        
        // Update the topics array by removing the unlinked time series
        updatedItem.topographicalTable = {
          ...prev.topographicalTable,
          topics: prev.topographicalTable.topics.map((topic) => {
            if (topic.id === topicId) {
              return {
                ...topic,
                timeSeries: topic.timeSeries.filter((series) => series.id !== timeSeriesId),
              }
            }
            return topic
          }),
        }
        
        return updatedItem
      })

      // Show success message
      toast({
        title: "Success",
        description: "Time series unlinked successfully",
      })
    } catch (err) {
      console.error('Error unlinking time series:', err)
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to unlink time series",
        variant: "destructive"
      })
    } finally {
      setIsUnlinkingTimeSeries(false)
    }
  }

  // Function to handle deleting the inventory item
  const handleDeleteInventoryItem = async () => {
    setIsDeleting(true)
    
    try {
      // Send the delete request
      const response = await fetch(`/api/inventory/${inventoryItem.id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Failed to delete inventory item: ${response.statusText}`)
      }
      
      const data = await response.json()
      
      // Close the dialog
      setIsDeleteDialogOpen(false)
      
      // Navigate back to the room page
      router.push(`/rooms/${inventoryItem.roomId}`)
    } catch (err) {
      console.error('Error deleting inventory item:', err)
      setSaveError(err instanceof Error ? err.message : 'Failed to delete inventory item')
      setIsDeleting(false)
    }
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
      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <span className="ml-2">Loading inventory item...</span>
        </div>
      ) : error ? (
        <div className="bg-destructive/15 text-destructive p-4 rounded-md">
          <p>Error: {error}</p>
          <Button variant="outline" className="mt-2" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      ) : (
        <>
          {/* Breadcrumb Navigation */}
          <BreadcrumbNav 
            roomId={inventoryItem.roomId} 
            roomName={inventoryItem.roomName} 
            itemName={inventoryItem.name} 
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link href={`/rooms/${inventoryItem.roomId}`}>
                <Button variant="outline" size="icon">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <h2 className="text-3xl font-bold tracking-tight">{inventoryItem.name || 'Unnamed Item'}</h2>
            </div>
            <Button 
              variant="destructive" 
              onClick={() => setIsDeleteDialogOpen(true)}
              disabled={isDeleting}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              {isDeleting ? "Deleting..." : "Delete Item"}
            </Button>
          </div>
        </>
      )}

      {!isLoading && !error && (
        <Tabs defaultValue="details">
          <TabsList>
            <TabsTrigger value="details">Item Details</TabsTrigger>
            <TabsTrigger value="position">Position & Scale</TabsTrigger>
            {inventoryItem.inventoryType === "0" && (
              <TabsTrigger value="topics">Topics & Time Series</TabsTrigger>
            )}
          </TabsList>

        {saveSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">Changes saved successfully!</span>
        </div>
      )}
      
      {saveError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">Error: {saveError}</span>
        </div>
      )}

      <TabsContent value="details" className="space-y-4">
        <ItemDetailsTab 
          inventoryItem={inventoryItem}
          handleInputChange={handleInputChange}
          setInventoryItem={setInventoryItem}
          handleSaveChanges={handleSaveChanges}
        />
      </TabsContent>

      <TabsContent value="position" className="space-y-4">
        <PositionScaleTab 
          inventoryItem={inventoryItem}
          handlePositionChange={handlePositionChange}
          handleRotationChange={handleRotationChange}
          handleScaleChange={handleScaleChange}
          handleSaveChanges={handleSaveChanges}
        />
      </TabsContent>

      {inventoryItem.inventoryType === "0" && (
        <TabsContent value="topics" className="space-y-4">
          <TopicsTab 
            inventoryItem={inventoryItem}
            handleTopicChange={handleTopicChange}
            setIsAddTopicDialogOpen={setIsAddTopicDialogOpen}
            openLinkTimeSeriesDialog={openLinkTimeSeriesDialog}
            handleSaveTopics={handleSaveTopics}
            handleUnlinkTimeSeries={handleUnlinkTimeSeries}
          />
        </TabsContent>
      )}
      </Tabs>
      )}

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
        isLoading={isLinkingTimeSeries}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the inventory item "{inventoryItem.name}" and all its related data, including:
              {inventoryItem.inventoryType === "0" && (
                <ul className="list-disc pl-5 mt-2">
                  <li>The topographical table</li>
                  <li>All {inventoryItem.topographicalTable.topics.length} topics</li>
                  <li>All time series links</li>
                </ul>
              )}
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async (e) => {
                e.preventDefault();
                await handleDeleteInventoryItem();
              }}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}