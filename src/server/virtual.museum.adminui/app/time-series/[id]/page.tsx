"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import {
  TimeSeriesDetailsTab,
  GeoEventGroupsTab,
  GeoEventDialog,
  TimeSeries,
  GeoEvent,
  GeoEventGroup
} from "./components"

// Mock data for a single time series
const timeSeriesData: TimeSeries = {
  id: "1",
  name: "World War II Timeline",
  description: "Major events during World War II (1939-1945)",
  geoEventGroups: [
    {
      id: "1",
      label: "European Theater",
      description: "Major events in the European Theater of World War II",
      geoEvents: [
        {
          id: "1",
          name: "Invasion of Poland",
          description: "Germany invades Poland, marking the start of World War II",
          dateTime: "1939-09-01T04:45:00Z",
          latitude: 52.2297,
          longitude: 21.0122,
          hasMultimediaPresentation: true,
          multimediaPresentationId: "10",
        },
        {
          id: "2",
          name: "Battle of Britain",
          description: "Air campaign waged by the German Air Force against the United Kingdom",
          dateTime: "1940-07-10T00:00:00Z",
          latitude: 51.5074,
          longitude: -0.1278,
          hasMultimediaPresentation: true,
          multimediaPresentationId: "11",
        },
        {
          id: "3",
          name: "D-Day Landings",
          description: "Allied invasion of Normandy in Operation Overlord",
          dateTime: "1944-06-06T06:30:00Z",
          latitude: 49.4144,
          longitude: -0.8322,
          hasMultimediaPresentation: true,
          multimediaPresentationId: "12",
        },
      ],
    },
    {
      id: "2",
      label: "Pacific Theater",
      description: "Major events in the Pacific Theater of World War II",
      geoEvents: [
        {
          id: "4",
          name: "Attack on Pearl Harbor",
          description: "Surprise military strike by the Imperial Japanese Navy Air Service",
          dateTime: "1941-12-07T07:48:00Z",
          latitude: 21.389,
          longitude: -157.9722,
          hasMultimediaPresentation: true,
          multimediaPresentationId: "13",
        },
        {
          id: "5",
          name: "Battle of Midway",
          description: "Decisive naval battle of the Pacific Theater",
          dateTime: "1942-06-04T00:00:00Z",
          latitude: 28.2101,
          longitude: -177.3761,
          hasMultimediaPresentation: false,
          multimediaPresentationId: null,
        },
      ],
    },
  ],
  // Options for presentations
  presentationOptions: [
    { id: "10", name: "Poland Invasion Presentation" },
    { id: "11", name: "Battle of Britain Presentation" },
    { id: "12", name: "D-Day Presentation" },
    { id: "13", name: "Pearl Harbor Presentation" },
    { id: "14", name: "Pacific War Overview" },
    { id: "15", name: "World War II Overview" },
  ],
}

export default function TimeSeriesDetailPage({ params }: { params: { id: string } }) {
  const [timeSeries, setTimeSeries] = useState<TimeSeries>(timeSeriesData)
  const [selectedEvent, setSelectedEvent] = useState<GeoEvent | null>(null)
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false)
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null)

  // Handler for time series details changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setTimeSeries((prev) => ({ ...prev, [name]: value }))
  }

  // Handler for saving time series details
  const handleSaveTimeSeries = () => {
    // Implement API call to save time series
    console.log("Saving time series:", timeSeries)
    // TODO: Add toast notification for success/error
  }

  // Handler for event input changes
  const handleEventInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setSelectedEvent((prev) => prev ? { ...prev, [name]: value } : null)
  }

  // Handler for presentation selection
  const handlePresentationChange = (value: string) => {
    setSelectedEvent((prev) => {
      if (!prev) return null
      return {
        ...prev,
        multimediaPresentationId: value === "none" ? null : value,
        hasMultimediaPresentation: value !== "none",
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

  const handleDeleteEvent = (eventId: string) => {
    // Implement deleting an event
    console.log("Deleting event:", eventId)
    // TODO: Add confirmation dialog
  }

  const handleViewPresentation = (presentationId: string) => {
    // Implement viewing a presentation
    console.log("Viewing presentation:", presentationId)
    // TODO: Navigate to presentation page
  }

  const handleSaveEvent = () => {
    if (!selectedEvent) return

    if (selectedEvent.id.startsWith("new-") && selectedGroupId) {
      // Add new event
      setTimeSeries((prev) => ({
        ...prev,
        geoEventGroups: prev.geoEventGroups.map((group) =>
          group.id === selectedGroupId
            ? { ...group, geoEvents: [...group.geoEvents, { ...selectedEvent, id: `${Date.now()}` }] }
            : group,
        ),
      }))
    } else {
      // Update existing event
      setTimeSeries((prev) => ({
        ...prev,
        geoEventGroups: prev.geoEventGroups.map((group) => ({
          ...group,
          geoEvents: group.geoEvents.map((event) => (event.id === selectedEvent.id ? selectedEvent : event)),
        })),
      }))
    }

    setIsEventDialogOpen(false)
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center gap-2">
        <Link href="/time-series">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h2 className="text-3xl font-bold tracking-tight">{timeSeries.name}</h2>
      </div>

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
    </div>
  )
}