"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, FileAudio, FileImage, FileVideo, Save, Trash2 } from "lucide-react"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"

// Mock data for a single media file
const mediaFileData = {
  id: "3",
  fileName: "uss_arizona.jpg",
  name: "USS Arizona",
  description:
    "The USS Arizona battleship before the attack on Pearl Harbor. This historic photograph shows the ship in its prime before it was sunk during the Japanese attack on December 7, 1941.",
  durationInSeconds: 0,
  type: "Image2D",
  url: "/placeholder.svg?height=400&width=600",
  usedInPresentations: [
    {
      id: "1",
      name: "Pearl Harbor Attack",
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
      return <FileImage className="h-5 w-5" />
  }
}

// Helper function to get media type label
const getMediaTypeLabel = (type: string) => {
  switch (type) {
    case "Audio":
      return "Audio"
    case "Video2D":
      return "2D Video"
    case "Video360":
      return "360° Video"
    case "Image2D":
      return "2D Image"
    case "Image360":
      return "360° Image"
    default:
      return type
  }
}

export default function MediaDetailPage({ params }: { params: { id: string } }) {
  const [mediaFile, setMediaFile] = useState(mediaFileData)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setMediaFile((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center gap-2">
        <Link href="/media">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h2 className="text-3xl font-bold tracking-tight">{mediaFile.name}</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="overflow-hidden">
          <div className="relative aspect-video bg-muted">
            <Image src={mediaFile.url || "/placeholder.svg"} alt={mediaFile.name} fill className="object-contain" />
          </div>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Badge variant="outline">{getMediaTypeLabel(mediaFile.type)}</Badge>
              <span className="text-sm text-muted-foreground">{mediaFile.fileName}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Media Information</CardTitle>
            <CardDescription>Edit the details of this media file</CardDescription>
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
                  value={mediaFile.name}
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
                  value={mediaFile.description}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="type" className="text-right">
                  Media Type
                </Label>
                <Select
                  value={mediaFile.type}
                  onValueChange={(value) => setMediaFile((prev) => ({ ...prev, type: value }))}
                >
                  <SelectTrigger id="type" className="col-span-3">
                    <SelectValue placeholder="Select media type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Audio">Audio</SelectItem>
                    <SelectItem value="Image2D">2D Image</SelectItem>
                    <SelectItem value="Image360">360° Image</SelectItem>
                    <SelectItem value="Video2D">2D Video</SelectItem>
                    <SelectItem value="Video360">360° Video</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {(mediaFile.type === "Audio" || mediaFile.type === "Video2D" || mediaFile.type === "Video360") && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="duration" className="text-right">
                    Duration (seconds)
                  </Label>
                  <Input
                    id="duration"
                    name="durationInSeconds"
                    type="number"
                    value={mediaFile.durationInSeconds}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-2 justify-between">
              <Button variant="destructive">
                <Trash2 className="mr-2 h-4 w-4" /> Delete Media
              </Button>
              <Button>
                <Save className="mr-2 h-4 w-4" /> Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Used In Presentations</CardTitle>
          <CardDescription>This media file is used in the following presentations</CardDescription>
        </CardHeader>
        <CardContent>
          {mediaFile.usedInPresentations.length > 0 ? (
            <ul className="space-y-2">
              {mediaFile.usedInPresentations.map((presentation) => (
                <li key={presentation.id}>
                  <Link href={`/presentations/${presentation.id}`} className="text-primary hover:underline">
                    {presentation.name}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">This media file is not used in any presentations.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
