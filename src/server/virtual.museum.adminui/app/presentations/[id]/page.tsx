"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, ArrowUpDown, FileAudio, FileImage, FileVideo, Film, Plus, Save, Trash2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// Mock data for a single presentation
const presentationData = {
  id: "1",
  name: "Pearl Harbor Attack",
  description: "Multimedia presentation about the attack on Pearl Harbor",
  presentationItems: [
    {
      id: "1",
      slotNumber: 0,
      sequenceNumber: 1,
      durationInSeconds: 30,
      mediaFile: {
        id: "audio1",
        fileName: "pearl_harbor_radio.mp3",
        name: "Pearl Harbor Radio Broadcast",
        description: "Original radio broadcast announcing the attack",
        durationInSeconds: 30,
        type: "Audio",
        url: "/placeholder.svg?height=80&width=300",
      },
    },
    {
      id: "2",
      slotNumber: 1,
      sequenceNumber: 1,
      durationInSeconds: 45,
      mediaFile: {
        id: "360-1",
        fileName: "pearl_harbor_360.jpg",
        name: "Pearl Harbor 360° View",
        description: "360-degree panorama of Pearl Harbor",
        durationInSeconds: 0,
        type: "Image360",
        url: "/placeholder.svg?height=200&width=200",
      },
    },
    {
      id: "3",
      slotNumber: 2,
      sequenceNumber: 1,
      durationInSeconds: 20,
      mediaFile: {
        id: "img1",
        fileName: "uss_arizona.jpg",
        name: "USS Arizona",
        description: "The USS Arizona battleship before the attack",
        durationInSeconds: 0,
        type: "Image2D",
        url: "/placeholder.svg?height=150&width=300",
      },
    },
    {
      id: "4",
      slotNumber: 2,
      sequenceNumber: 2,
      durationInSeconds: 25,
      mediaFile: {
        id: "vid1",
        fileName: "attack_footage.mp4",
        name: "Attack Footage",
        description: "Historical footage of the attack",
        durationInSeconds: 25,
        type: "Video2D",
        url: "/placeholder.svg?height=150&width=300",
      },
    },
    {
      id: "5",
      slotNumber: 3,
      sequenceNumber: 1,
      durationInSeconds: 40,
      mediaFile: {
        id: "img2",
        fileName: "aftermath.jpg",
        name: "Aftermath",
        description: "Damage assessment after the attack",
        durationInSeconds: 0,
        type: "Image2D",
        url: "/placeholder.svg?height=150&width=300",
      },
    },
  ],
}

// Helper function to get media type icon
const getMediaTypeIcon = (type: string) => {
  switch (type) {
    case "Audio":
      return <FileAudio className="h-5 w-5" />
    case "Video2D":
    case "Video360":
      return <FileVideo className="h-5 w-5" />
    case "Image2D":
    case "Image360":
      return <FileImage className="h-5 w-5" />
    default:
      return <Film className="h-5 w-5" />
  }
}

// Helper function to get slot name
const getSlotName = (slotNumber: number) => {
  switch (slotNumber) {
    case 0:
      return "Audio Only"
    case 1:
      return "360° Dome"
    default:
      return `Display ${slotNumber}`
  }
}

export default function PresentationDetailPage({ params }: { params: { id: string } }) {
  const [presentation, setPresentation] = useState(presentationData)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setPresentation((prev) => ({ ...prev, [name]: value }))
  }

  const handlePresentationItemChange = (itemId: string, field: string, value: number) => {
    setPresentation((prev) => ({
      ...prev,
      presentationItems: prev.presentationItems.map((item) =>
        item.id === itemId ? { ...item, [field]: value } : item,
      ),
    }))
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center gap-2">
        <Link href="/presentations">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h2 className="text-3xl font-bold tracking-tight">{presentation.name}</h2>
      </div>

      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">Presentation Details</TabsTrigger>
          <TabsTrigger value="items">Presentation Items</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Presentation Information</CardTitle>
              <CardDescription>Edit the details of this multimedia presentation</CardDescription>
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
                    value={presentation.name}
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
                    value={presentation.description}
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

        <TabsContent value="items" className="space-y-4">
          <div className="flex justify-between">
            <h3 className="text-lg font-medium">Presentation Items</h3>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Item
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Presentation Sequence</CardTitle>
              <CardDescription>Manage the media items in this presentation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[0, 1, 2, 3].map((slotNumber) => {
                  const slotItems = presentation.presentationItems
                    .filter((item) => item.slotNumber === slotNumber)
                    .sort((a, b) => a.sequenceNumber - b.sequenceNumber)

                  if (slotItems.length === 0) return null

                  return (
                    <div key={slotNumber} className="space-y-2">
                      <h4 className="font-medium">
                        Slot {slotNumber}: {getSlotName(slotNumber)}
                      </h4>
                      <div className="space-y-2">
                        {slotItems.map((item) => (
                          <Card key={item.id} className="overflow-hidden">
                            <div className="flex flex-col sm:flex-row">
                              <div className="relative w-full sm:w-1/4 h-40 sm:h-auto bg-muted">
                                <Image
                                  src={item.mediaFile.url || "/placeholder.svg"}
                                  alt={item.mediaFile.name}
                                  fill
                                  className="object-cover"
                                />
                                <div className="absolute top-2 left-2 bg-background/80 rounded-full p-1">
                                  {getMediaTypeIcon(item.mediaFile.type)}
                                </div>
                              </div>
                              <div className="p-4 flex-1">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h5 className="font-medium">{item.mediaFile.name}</h5>
                                    <p className="text-sm text-muted-foreground">{item.mediaFile.description}</p>
                                  </div>
                                  <div className="flex gap-1">
                                    <Button variant="outline" size="icon">
                                      <ArrowUpDown className="h-4 w-4" />
                                    </Button>
                                    <Button variant="outline" size="icon">
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label htmlFor={`sequence-${item.id}`}>Sequence Number</Label>
                                    <Input
                                      id={`sequence-${item.id}`}
                                      type="number"
                                      value={item.sequenceNumber}
                                      onChange={(e) =>
                                        handlePresentationItemChange(
                                          item.id,
                                          "sequenceNumber",
                                          Number.parseInt(e.target.value),
                                        )
                                      }
                                      min={1}
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor={`duration-${item.id}`}>Duration (seconds)</Label>
                                    <Input
                                      id={`duration-${item.id}`}
                                      type="number"
                                      value={item.durationInSeconds}
                                      onChange={(e) =>
                                        handlePresentationItemChange(
                                          item.id,
                                          "durationInSeconds",
                                          Number.parseInt(e.target.value),
                                        )
                                      }
                                      min={1}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
