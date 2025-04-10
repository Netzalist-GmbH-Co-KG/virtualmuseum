"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { FileAudio, FileImage, FileVideo, Filter, Plus, Search } from "lucide-react"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"

// Mock data for media files
const mediaFilesData = [
  {
    id: "1",
    fileName: "pearl_harbor_radio.mp3",
    name: "Pearl Harbor Radio Broadcast",
    description: "Original radio broadcast announcing the attack",
    durationInSeconds: 30,
    type: "Audio",
    url: "/placeholder.svg?height=150&width=150",
  },
  {
    id: "2",
    fileName: "pearl_harbor_360.jpg",
    name: "Pearl Harbor 360° View",
    description: "360-degree panorama of Pearl Harbor",
    durationInSeconds: 0,
    type: "Image360",
    url: "/placeholder.svg?height=150&width=150",
  },
  {
    id: "3",
    fileName: "uss_arizona.jpg",
    name: "USS Arizona",
    description: "The USS Arizona battleship before the attack",
    durationInSeconds: 0,
    type: "Image2D",
    url: "/placeholder.svg?height=150&width=150",
  },
  {
    id: "4",
    fileName: "attack_footage.mp4",
    name: "Attack Footage",
    description: "Historical footage of the attack",
    durationInSeconds: 25,
    type: "Video2D",
    url: "/placeholder.svg?height=150&width=150",
  },
  {
    id: "5",
    fileName: "aftermath.jpg",
    name: "Aftermath",
    description: "Damage assessment after the attack",
    durationInSeconds: 0,
    type: "Image2D",
    url: "/placeholder.svg?height=150&width=150",
  },
  {
    id: "6",
    fileName: "moon_landing.mp4",
    name: "Moon Landing",
    description: "Neil Armstrong's first steps on the moon",
    durationInSeconds: 45,
    type: "Video2D",
    url: "/placeholder.svg?height=150&width=150",
  },
  {
    id: "7",
    fileName: "space_360.jpg",
    name: "Earth from Space",
    description: "360-degree view of Earth from space",
    durationInSeconds: 0,
    type: "Image360",
    url: "/placeholder.svg?height=150&width=150",
  },
  {
    id: "8",
    fileName: "industrial_machines.jpg",
    name: "Industrial Revolution Machines",
    description: "Early industrial machinery",
    durationInSeconds: 0,
    type: "Image2D",
    url: "/placeholder.svg?height=150&width=150",
  },
]

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

export default function MediaPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [mediaTypeFilter, setMediaTypeFilter] = useState("all")

  // Filter media files based on search term and media type
  const filteredMediaFiles = mediaFilesData.filter((file) => {
    const matchesSearch =
      file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = mediaTypeFilter === "all" || file.type.toLowerCase().includes(mediaTypeFilter.toLowerCase())

    return matchesSearch && matchesType
  })

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Media Library</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Upload Media
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search media files..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={mediaTypeFilter} onValueChange={setMediaTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="audio">Audio</SelectItem>
              <SelectItem value="video">Videos</SelectItem>
              <SelectItem value="image">Images</SelectItem>
              <SelectItem value="360">360° Media</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filteredMediaFiles.map((file) => (
          <Link href={`/media/${file.id}`} key={file.id}>
            <Card className="overflow-hidden hover:bg-accent/50 transition-colors cursor-pointer h-full">
              <div className="relative aspect-square bg-muted">
                <Image src={file.url || "/placeholder.svg"} alt={file.name} fill className="object-cover" />
                <div className="absolute top-2 left-2 bg-background/80 rounded-full p-1">
                  {getMediaTypeIcon(file.type)}
                </div>
                {file.durationInSeconds > 0 && (
                  <div className="absolute bottom-2 right-2 bg-background/80 rounded-md px-2 py-1 text-xs">
                    {Math.floor(file.durationInSeconds / 60)}:
                    {(file.durationInSeconds % 60).toString().padStart(2, "0")}
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <div className="space-y-1">
                  <div className="font-medium truncate">{file.name}</div>
                  <div className="text-sm text-muted-foreground line-clamp-2">{file.description}</div>
                  <div className="pt-2">
                    <Badge variant="outline">{getMediaTypeLabel(file.type)}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
