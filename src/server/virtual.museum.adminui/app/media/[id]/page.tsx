"use client"

import React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, ArrowLeft, FileAudio, FileImage, FileVideo, Loader2, Save, Trash2 } from "lucide-react"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Interface for media file data
interface MediaFile {
  id: string;
  fileName: string;
  name: string;
  description: string;
  durationInSeconds: number;
  type: string;
  url: string;
  usedInPresentations: {
    id: string;
    name: string;
  }[];
}

// Helper function to get media type icon
const getMediaTypeIcon = (type: string) => {
  switch (type) {
    case "Audio":
      return <FileAudio className="h-5 w-5" />
    case "Video2D":
    case "Video3D":
    case "Video360":
      return <FileVideo className="h-5 w-5" />
    case "Image2D":
    case "Image3D":
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
    case "Video3D":
      return "3D Video"
    case "Video360":
      return "360° Video"
    case "Image2D":
      return "2D Image"
    case "Image3D":
      return "3D Image"
    case "Image360":
      return "360° Image"
    default:
      return type
  }
}

export default function MediaDetailPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  // Unwrap params with React.use()
  const unwrappedParams = 'then' in params ? React.use(params) : params;
  const { toast } = useToast()
  const router = useRouter()
  const [mediaFile, setMediaFile] = useState<MediaFile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch media file data
  useEffect(() => {
    const fetchMediaFile = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        const response = await fetch(`/api/media/${unwrappedParams.id}`)
        
        if (!response.ok) {
          throw new Error(`Error fetching media file: ${response.status} ${response.statusText}`)
        }
        
        const data = await response.json()
        setMediaFile(data)
      } catch (err) {
        console.error('Failed to fetch media file:', err)
        setError(err instanceof Error ? err.message : 'Failed to load media file')
        toast({
          title: "Error",
          description: err instanceof Error ? err.message : 'Failed to load media file',
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchMediaFile()
  }, [unwrappedParams.id, toast])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!mediaFile) return
    
    const { name, value } = e.target
    setMediaFile((prev) => prev ? { ...prev, [name]: value } : null)
  }
  
  const handleSave = async () => {
    if (!mediaFile) return
    
    try {
      setIsSaving(true)
      
      const response = await fetch(`/api/media/${unwrappedParams.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mediaFile),
      })
      
      if (!response.ok) {
        throw new Error(`Error updating media file: ${response.status} ${response.statusText}`)
      }
      
      const updatedData = await response.json()
      setMediaFile(updatedData)
      
      toast({
        title: "Success",
        description: "Media file updated successfully",
      })
    } catch (err) {
      console.error('Failed to update media file:', err)
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : 'Failed to update media file',
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }
  
  const handleDelete = async () => {
    if (!mediaFile || !confirm("Are you sure you want to delete this media file? This action cannot be undone.")) return
    
    try {
      setIsDeleting(true)
      
      const response = await fetch(`/api/media/${unwrappedParams.id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        throw new Error(`Error deleting media file: ${response.status} ${response.statusText}`)
      }
      
      toast({
        title: "Success",
        description: "Media file deleted successfully",
      })
      
      // Navigate back to the media list
      router.push('/media')
    } catch (err) {
      console.error('Failed to delete media file:', err)
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : 'Failed to delete media file',
        variant: "destructive"
      })
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p>Loading media file...</p>
        </div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="flex-1 p-8 pt-6">
        <div className="flex items-center gap-2 mb-4">
          <Link href="/media">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h2 className="text-3xl font-bold tracking-tight">Media File Error</h2>
        </div>
        
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        
        <div className="mt-4">
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    )
  }
  
  if (!mediaFile) {
    return (
      <div className="flex-1 p-8 pt-6">
        <div className="flex items-center gap-2 mb-4">
          <Link href="/media">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h2 className="text-3xl font-bold tracking-tight">Media File Not Found</h2>
        </div>
        
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Not Found</AlertTitle>
          <AlertDescription>The requested media file could not be found.</AlertDescription>
        </Alert>
      </div>
    )
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
                  onValueChange={(value) => setMediaFile((prev) => prev ? { ...prev, type: value } : null)}
                >
                  <SelectTrigger id="type" className="col-span-3">
                    <SelectValue placeholder="Select media type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Audio">Audio</SelectItem>
                    <SelectItem value="Image2D">2D Image</SelectItem>
                    <SelectItem value="Image3D">3D Image</SelectItem>
                    <SelectItem value="Image360">360° Image</SelectItem>
                    <SelectItem value="Video2D">2D Video</SelectItem>
                    <SelectItem value="Video3D">3D Video</SelectItem>
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
              <Button 
                variant="destructive" 
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="mr-2 h-4 w-4" /> Delete Media
                  </>
                )}
              </Button>
              <Button 
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" /> Save Changes
                  </>
                )}
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
