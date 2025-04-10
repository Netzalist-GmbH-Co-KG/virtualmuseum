"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { FileAudio, FileImage, FileVideo, Filter, Plus, Search } from "lucide-react"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"

// Define media file interface
interface MediaFile {
  id: string;
  fileName: string;
  name: string;
  description: string;
  durationInSeconds: number;
  type: string;
  url: string;
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
    case "Document":
      return <FileImage className="h-5 w-5" />
    case "Other":
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
    case "Document":
      return "Document"
    case "Other":
      return "Other Media"
    default:
      return type
  }
}

export default function MediaPage() {
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [mediaTypeFilter, setMediaTypeFilter] = useState("all")
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch media files from the API
  useEffect(() => {
    const fetchMediaFiles = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        // Build the query parameters
        const params = new URLSearchParams()
        if (searchTerm) params.append('search', searchTerm)
        if (mediaTypeFilter !== 'all') params.append('type', mediaTypeFilter)
        
        const response = await fetch(`/api/media?${params.toString()}`)
        
        if (!response.ok) {
          throw new Error(`Error fetching media files: ${response.status} ${response.statusText}`)
        }
        
        const data = await response.json()
        setMediaFiles(data.mediaFiles || [])
      } catch (err) {
        console.error('Failed to fetch media files:', err)
        setError(err instanceof Error ? err.message : 'Failed to load media files')
        toast({
          title: "Error",
          description: err instanceof Error ? err.message : 'Failed to load media files',
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchMediaFiles()
  }, [searchTerm, mediaTypeFilter, toast])

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
              <SelectItem value="document">Documents</SelectItem>
              <SelectItem value="other">Other Media</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <span className="ml-2">Loading media files...</span>
        </div>
      ) : error ? (
        <div className="bg-destructive/15 text-destructive p-4 rounded-md">
          <p>Error: {error}</p>
          <Button variant="outline" className="mt-2" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      ) : mediaFiles.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No media files found</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {mediaFiles.map((file) => (
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
      )}
    </div>
  )
}
