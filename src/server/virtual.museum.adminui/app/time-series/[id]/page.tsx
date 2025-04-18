"use client"

import React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "@/components/ui/use-toast"
import {
  TimeSeriesDetailsTab,
  GeoEventGroupsTab,
  GeoEventDialog,
  TimeSeries,
  GeoEvent,
  GeoEventGroup
} from "./components"

// Default empty time series state
const emptyTimeSeries: TimeSeries = {
  id: "",
  name: "",
  description: "",
  geoEventGroups: [],
  presentationOptions: [],
}

export default function TimeSeriesDetailPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  // Unwrap params with React.use()
  const unwrappedParams = 'then' in params ? React.use(params) : params;
  const router = useRouter()
  const [timeSeries, setTimeSeries] = useState<TimeSeries>(emptyTimeSeries)
  const [selectedEvent, setSelectedEvent] = useState<GeoEvent | null>(null)
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false)
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Fetch time series data
  useEffect(() => {
    const fetchTimeSeriesData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        const response = await fetch(`/api/time-series/${unwrappedParams.id}`)
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error(`Time series with ID ${unwrappedParams.id} not found`)
          }
          throw new Error(`Error fetching time series: ${response.status} ${response.statusText}`)
        }
        
        const data = await response.json()
        setTimeSeries(data)
      } catch (err) {
        console.error('Failed to fetch time series details:', err)
        setError(err instanceof Error ? err.message : 'Failed to load time series details')
        toast({
          title: "Error",
          description: err instanceof Error ? err.message : 'Failed to load time series details',
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchTimeSeriesData()
  }, [unwrappedParams.id])

  // Handler for time series details changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setTimeSeries((prev) => ({ ...prev, [name]: value }))
  }

  // Handler for saving time series details
  const handleSaveTimeSeries = async () => {
    try {
      const response = await fetch(`/api/time-series/${unwrappedParams.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: timeSeries.name,
          description: timeSeries.description,
        }),
      })
      
      if (!response.ok) {
        throw new Error(`Error updating time series: ${response.status} ${response.statusText}`)
      }
      
      toast({
        title: "Success",
        description: "Time series details saved successfully",
      })
    } catch (err) {
      console.error('Failed to save time series:', err)
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : 'Failed to save time series',
        variant: "destructive"
      })
    }
  }

  // Handler for event input changes
  const handleEventInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    
    // Handle numeric values
    if (name === "latitude" || name === "longitude") {
      const numValue = parseFloat(value)
      setSelectedEvent((prev) => prev ? { ...prev, [name]: numValue } : null)
      return
    }
    
    setSelectedEvent((prev) => prev ? { ...prev, [name]: value } : null)
  }

  // Handler for presentation selection
  const handlePresentationChange = (value: string) => {
    setSelectedEvent((prev) => {
      if (!prev) return null
      
      const multimediaPresentationId = value === "none" ? null : value
      const hasMultimediaPresentation = !!multimediaPresentationId
      
      return {
        ...prev,
        multimediaPresentationId,
        hasMultimediaPresentation,
      }
    })
  }

  // Handlers for event groups
  const handleAddGroup = () => {
    // Implement adding a new group
    console.log("Adding new group")
    // TODO: Show dialog for adding a group
  }

  const handleEditGroup = (groupId: string) => {
    // Implement editing a group
    console.log("Editing group:", groupId)
    // TODO: Show dialog for editing a group
  }

  const handleDeleteGroup = (groupId: string) => {
    // Implement deleting a group
    console.log("Deleting group:", groupId)
    // TODO: Add confirmation dialog
  }

  // Handlers for events
  const handleAddEvent = (groupId: string) => {
    setSelectedGroupId(groupId)
    setSelectedEvent({
      id: `new-${Date.now()}`,
      name: "",
      description: "",
      dateTime: new Date().toISOString(),
      latitude: 0,
      longitude: 0,
      hasMultimediaPresentation: false,
      multimediaPresentationId: null,
    })
    setIsEventDialogOpen(true)
  }

  const handleEditEvent = (event: GeoEvent) => {
    setSelectedEvent(event)
    setIsEventDialogOpen(true)
  }

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      return;
    }
    
    try {
      // Show loading state
      toast({
        title: "Deleting event",
        description: "Please wait..."
      });
      
      // Send the delete request to the API
      const response = await fetch(`/api/time-series/${unwrappedParams.id}/events/${eventId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to delete event: ${response.statusText}`);
      }
      
      // Update the UI by removing the deleted event
      setTimeSeries((prev) => {
        const updatedGroups = prev.geoEventGroups.map((group) => ({
          ...group,
          geoEvents: group.geoEvents.filter((event) => event.id !== eventId)
        }));
        
        return {
          ...prev,
          geoEventGroups: updatedGroups
        };
      });
      
      // Show success message
      toast({
        title: "Success",
        description: "Event deleted successfully"
      });
    } catch (err) {
      console.error('Error deleting event:', err);
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to delete event",
        variant: "destructive"
      });
    }
  }

  const handleViewPresentation = (presentationId: string) => {
    // Navigate to the presentation detail page
    router.push(`/presentations/${presentationId}`);
  }

  const handleSaveEvent = async () => {
    if (!selectedEvent) return

    try {
      // Show loading state
      toast({
        title: "Saving event",
        description: "Please wait..."
      })

      // Prepare the event data for the API
      const eventData = {
        id: selectedEvent.id.startsWith("new-") ? undefined : selectedEvent.id,
        groupId: selectedGroupId || selectedEvent.id.startsWith("new-") ? 
          selectedGroupId! : // For new events, use the selected group ID
          timeSeries.geoEventGroups.find(group => 
            group.geoEvents.some(event => event.id === selectedEvent.id)
          )?.id || '', // For existing events, find the group ID
        name: selectedEvent.name,
        description: selectedEvent.description,
        dateTime: selectedEvent.dateTime,
        latitude: selectedEvent.latitude,
        longitude: selectedEvent.longitude,
        multimediaPresentationId: selectedEvent.multimediaPresentationId
      }
      
      // Debug the event data being sent to the API
      console.log('Saving event - Selected event data:', {
        id: selectedEvent.id,
        name: selectedEvent.name,
        hasMultimediaPresentation: selectedEvent.hasMultimediaPresentation,
        multimediaPresentationId: selectedEvent.multimediaPresentationId
      });
      
      console.log('Saving event - API request data:', eventData);

      // Send the request to the API
      const response = await fetch(`/api/time-series/${unwrappedParams.id}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Failed to save event: ${response.statusText}`)
      }

      // Get the saved event from the response
      const savedEvent = await response.json()
      
      // Debug the response from the API
      console.log('Saving event - API response:', savedEvent);

      // Update the UI with the saved event
      setTimeSeries((prev) => {
        // Find the group that contains this event
        const updatedGroups = prev.geoEventGroups.map((group) => {
          // For new events
          if (selectedEvent.id.startsWith("new-") && group.id === eventData.groupId) {
            return {
              ...group,
              geoEvents: [...group.geoEvents, {
                id: savedEvent.id,
                name: savedEvent.name,
                description: savedEvent.description,
                dateTime: savedEvent.dateTime,
                latitude: savedEvent.latitude,
                longitude: savedEvent.longitude,
                hasMultimediaPresentation: savedEvent.hasMultimediaPresentation,
                multimediaPresentationId: savedEvent.multimediaPresentationId
              }]
            }
          }
          
          // For existing events
          return {
            ...group,
            geoEvents: group.geoEvents.map((event) => 
              event.id === selectedEvent.id ? {
                id: savedEvent.id,
                name: savedEvent.name,
                description: savedEvent.description,
                dateTime: savedEvent.dateTime,
                latitude: savedEvent.latitude,
                longitude: savedEvent.longitude,
                hasMultimediaPresentation: savedEvent.hasMultimediaPresentation,
                multimediaPresentationId: savedEvent.multimediaPresentationId
              } : event
            )
          }
        })

        return {
          ...prev,
          geoEventGroups: updatedGroups
        }
      })

      // Show success message
      toast({
        title: "Success",
        description: selectedEvent.id.startsWith("new-") ? 
          "Event created successfully" : 
          "Event updated successfully"
      })

      // Close the dialog
      setIsEventDialogOpen(false)
    } catch (err) {
      console.error('Error saving event:', err)
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to save event",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center gap-2">
        <Link href="/time-series">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h2 className="text-3xl font-bold tracking-tight">
          {isLoading ? "Loading..." : error ? "Error" : timeSeries.name || "Unnamed Time Series"}
        </h2>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <span className="ml-2">Loading time series details...</span>
        </div>
      ) : error ? (
        <div className="bg-destructive/15 text-destructive p-4 rounded-md">
          <p>Error: {error}</p>
          <Button variant="outline" className="mt-2" onClick={() => router.push('/time-series')}>
            Return to Time Series List
          </Button>
        </div>
      ) : (

        <>
          <Tabs defaultValue="details">
            <TabsList>
              <TabsTrigger value="details">Time Series Details</TabsTrigger>
              <TabsTrigger value="events">Geo Event Groups</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4">
              <TimeSeriesDetailsTab
                name={timeSeries.name}
                description={timeSeries.description}
                onInputChange={handleInputChange}
                onSave={handleSaveTimeSeries}
              />
            </TabsContent>

            <TabsContent value="events" className="space-y-4">
              <GeoEventGroupsTab
                groups={timeSeries.geoEventGroups}
                onAddGroup={handleAddGroup}
                onEditGroup={handleEditGroup}
                onDeleteGroup={handleDeleteGroup}
                onAddEvent={handleAddEvent}
                onEditEvent={handleEditEvent}
                onDeleteEvent={handleDeleteEvent}
                onViewPresentation={handleViewPresentation}
              />
            </TabsContent>
          </Tabs>

          {/* Geo Event Dialog */}
          <GeoEventDialog
            open={isEventDialogOpen}
            onOpenChange={setIsEventDialogOpen}
            event={selectedEvent}
            presentationOptions={timeSeries.presentationOptions}
            onInputChange={handleEventInputChange}
            onPresentationChange={handlePresentationChange}
            onSave={handleSaveEvent}
          />
        </>
      )}
    </div>
  )
}