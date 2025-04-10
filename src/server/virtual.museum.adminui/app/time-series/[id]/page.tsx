"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Calendar, Edit, Film, MapPin, MoreHorizontal, Plus, Save, Trash2 } from "lucide-react"
import Link from "next/link"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data for a single time series
const timeSeriesData = {
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
  const [timeSeries, setTimeSeries] = useState(timeSeriesData)
  const [selectedEvent, setSelectedEvent] = useState<any>(null)
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false)
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setTimeSeries((prev) => ({ ...prev, [name]: value }))
  }

  const handleEventInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setSelectedEvent((prev: any) => ({ ...prev, [name]: value }))
  }

  const openNewEventDialog = (groupId: string) => {
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

  const openEditEventDialog = (event: any) => {
    setSelectedEvent(event)
    setIsEventDialogOpen(true)
  }

  const saveEvent = () => {
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
          <Card>
            <CardHeader>
              <CardTitle>Time Series Information</CardTitle>
              <CardDescription>Edit the details of this time series</CardDescription>
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
                    value={timeSeries.name}
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
                    value={timeSeries.description}
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

        <TabsContent value="events" className="space-y-4">
          <div className="flex justify-between">
            <h3 className="text-lg font-medium">Geo Event Groups</h3>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Group
            </Button>
          </div>

          <Accordion type="multiple" className="w-full">
            {timeSeries.geoEventGroups.map((group) => (
              <AccordionItem value={group.id} key={group.id}>
                <AccordionTrigger className="hover:bg-accent/50 px-4 rounded-md">
                  <div className="flex items-center justify-between w-full pr-4">
                    <div className="font-medium">{group.label}</div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{group.geoEvents.length} events</span>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" /> Edit Group
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Trash2 className="mr-2 h-4 w-4" /> Delete Group
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="p-4 space-y-4">
                    <p className="text-sm text-muted-foreground">{group.description}</p>

                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-medium">Geo Events</h4>
                      <Button size="sm" onClick={() => openNewEventDialog(group.id)}>
                        <Plus className="mr-2 h-3 w-3" /> Add Event
                      </Button>
                    </div>

                    <div className="space-y-2">
                      {group.geoEvents.map((event) => (
                        <Card key={event.id} className="hover:bg-accent/50 transition-colors">
                          <CardContent className="p-4 flex items-start justify-between">
                            <div className="space-y-1">
                              <div className="font-medium">{event.name}</div>
                              <div className="text-sm text-muted-foreground">{event.description}</div>
                              <div className="text-xs text-muted-foreground">
                                {new Date(event.dateTime).toLocaleDateString()} | Lat: {event.latitude.toFixed(4)},
                                Long: {event.longitude.toFixed(4)}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {event.hasMultimediaPresentation && (
                                <div className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                                  Has Presentation
                                </div>
                              )}
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => openEditEventDialog(event)}>
                                    <Edit className="mr-2 h-4 w-4" /> Edit Event
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Trash2 className="mr-2 h-4 w-4" /> Delete Event
                                  </DropdownMenuItem>
                                  {event.hasMultimediaPresentation && (
                                    <DropdownMenuItem>
                                      <Film className="mr-2 h-4 w-4" /> View Presentation
                                    </DropdownMenuItem>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </TabsContent>
      </Tabs>

      {/* Geo Event Dialog */}
      <Dialog open={isEventDialogOpen} onOpenChange={setIsEventDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{selectedEvent?.id.startsWith("new-") ? "Add New Geo Event" : "Edit Geo Event"}</DialogTitle>
            <DialogDescription>
              {selectedEvent?.id.startsWith("new-")
                ? "Create a new geographical event for this time series"
                : "Edit the details of this geographical event"}
            </DialogDescription>
          </DialogHeader>

          {selectedEvent && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="event-name" className="text-right">
                  Name
                </Label>
                <Input
                  id="event-name"
                  name="name"
                  value={selectedEvent.name}
                  onChange={handleEventInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="event-description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="event-description"
                  name="description"
                  value={selectedEvent.description}
                  onChange={handleEventInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="event-dateTime" className="text-right">
                  Date & Time
                </Label>
                <div className="col-span-3 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <Input
                    id="event-dateTime"
                    name="dateTime"
                    type="datetime-local"
                    value={new Date(selectedEvent.dateTime).toISOString().slice(0, 16)}
                    onChange={handleEventInputChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Location</Label>
                <div className="col-span-3 grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <Input
                      id="event-latitude"
                      name="latitude"
                      type="number"
                      step="0.0001"
                      placeholder="Latitude"
                      value={selectedEvent.latitude}
                      onChange={handleEventInputChange}
                    />
                  </div>
                  <Input
                    id="event-longitude"
                    name="longitude"
                    type="number"
                    step="0.0001"
                    placeholder="Longitude"
                    value={selectedEvent.longitude}
                    onChange={handleEventInputChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="event-presentation" className="text-right">
                  Presentation
                </Label>
                <div className="col-span-3 flex items-center gap-2">
                  <Film className="h-4 w-4 text-muted-foreground" />
                  <Select
                    value={selectedEvent.multimediaPresentationId || "none"}
                    onValueChange={(value) => {
                      setSelectedEvent((prev: any) => ({
                        ...prev,
                        multimediaPresentationId: value === "none" ? null : value,
                        hasMultimediaPresentation: value !== "none",
                      }))
                    }}
                  >
                    <SelectTrigger id="event-presentation" className="w-full">
                      <SelectValue placeholder="Select a presentation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {timeSeries.presentationOptions.map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                          {option.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEventDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveEvent}>Save Event</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
