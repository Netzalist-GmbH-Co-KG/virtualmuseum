"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileAudio, FileImage, FileVideo, Loader2, Upload } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Progress } from "@/components/ui/progress"

interface UploadMediaDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onUploadComplete: () => void
}

export function UploadMediaDialog({ open, onOpenChange, onUploadComplete }: UploadMediaDialogProps) {
  const { toast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [mediaType, setMediaType] = useState<string>("")
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setSelectedFile(file)

    // Create preview URL for images
    if (file) {
      if (file.type.startsWith("image/")) {
        const url = URL.createObjectURL(file)
        setPreviewUrl(url)
        
        // Auto-select image type based on file extension
        if (file.name.toLowerCase().endsWith(".jpg") || file.name.toLowerCase().endsWith(".jpeg") || 
            file.name.toLowerCase().endsWith(".png") || file.name.toLowerCase().endsWith(".gif")) {
          setMediaType("Image2D")
        }
      } else if (file.type.startsWith("video/")) {
        // Auto-select video type
        setMediaType("Video2D")
        setPreviewUrl(null)
      } else if (file.type.startsWith("audio/")) {
        // Auto-select audio type
        setMediaType("Audio")
        setPreviewUrl(null)
      }
      
      // Use filename as default name if not set
      if (!name) {
        // Remove extension from filename
        const fileName = file.name.split(".").slice(0, -1).join(".")
        setName(fileName)
      }
    } else {
      setPreviewUrl(null)
    }
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedFile) {
      toast({
        title: "Error",
        description: "Please select a file to upload",
        variant: "destructive",
      })
      return
    }
    
    if (!mediaType) {
      toast({
        title: "Error",
        description: "Please select a media type",
        variant: "destructive",
      })
      return
    }
    
    if (!name) {
      toast({
        title: "Error",
        description: "Please enter a name for the media",
        variant: "destructive",
      })
      return
    }
    
    try {
      setIsUploading(true)
      setUploadProgress(0)
      
      // Create FormData object
      const formData = new FormData()
      formData.append("file", selectedFile)
      formData.append("type", mediaType)
      formData.append("name", name)
      formData.append("description", description)
      
      // Upload file with progress tracking
      const xhr = new XMLHttpRequest()
      
      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100)
          setUploadProgress(progress)
        }
      })
      
      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          // Success
          toast({
            title: "Success",
            description: "Media uploaded successfully",
          })
          resetForm()
          onUploadComplete()
          onOpenChange(false)
        } else {
          // Error
          let errorMessage = "Failed to upload media"
          try {
            const response = JSON.parse(xhr.responseText)
            errorMessage = response.error || errorMessage
          } catch (e) {
            // Ignore parsing error
          }
          
          toast({
            title: "Error",
            description: errorMessage,
            variant: "destructive",
          })
        }
        setIsUploading(false)
      })
      
      xhr.addEventListener("error", () => {
        toast({
          title: "Error",
          description: "Failed to upload media. Network error.",
          variant: "destructive",
        })
        setIsUploading(false)
      })
      
      xhr.open("POST", "/api/media/upload")
      xhr.send(formData)
      
    } catch (error) {
      console.error("Error uploading file:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to upload media",
        variant: "destructive",
      })
      setIsUploading(false)
    }
  }
  
  // Reset form state
  const resetForm = () => {
    setSelectedFile(null)
    setMediaType("")
    setName("")
    setDescription("")
    setUploadProgress(0)
    setPreviewUrl(null)
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }
  
  // Handle dialog close
  const handleOpenChange = (open: boolean) => {
    if (!open && isUploading) {
      // Prevent closing during upload
      toast({
        title: "Upload in progress",
        description: "Please wait until the upload is complete",
        variant: "destructive",
      })
      return
    }
    
    if (!open) {
      resetForm()
    }
    
    onOpenChange(open)
  }
  
  // Get file type icon
  const getFileTypeIcon = () => {
    if (!selectedFile) return null
    
    if (selectedFile.type.startsWith("image/")) {
      return <FileImage className="h-8 w-8 text-primary" />
    } else if (selectedFile.type.startsWith("video/")) {
      return <FileVideo className="h-8 w-8 text-primary" />
    } else if (selectedFile.type.startsWith("audio/")) {
      return <FileAudio className="h-8 w-8 text-primary" />
    }
    
    return null
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Upload Media</DialogTitle>
            <DialogDescription>
              Upload images, videos, or audio files to the media library.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="file">File</Label>
              <Input
                id="file"
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/jpeg,image/png,image/gif,video/mp4,audio/mp3,audio/mpeg"
                disabled={isUploading}
              />
              
              {selectedFile && (
                <div className="flex items-center gap-2 text-sm">
                  {getFileTypeIcon()}
                  <span>{selectedFile.name}</span>
                  <span className="text-muted-foreground">
                    ({Math.round(selectedFile.size / 1024)} KB)
                  </span>
                </div>
              )}
              
              {previewUrl && (
                <div className="mt-2 relative aspect-video bg-muted rounded-md overflow-hidden">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="object-contain w-full h-full"
                  />
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="mediaType">Media Type</Label>
              <Select
                value={mediaType}
                onValueChange={setMediaType}
                disabled={isUploading}
              >
                <SelectTrigger id="mediaType">
                  <SelectValue placeholder="Select media type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Image2D">2D Image</SelectItem>
                  <SelectItem value="Image3D">3D Image</SelectItem>
                  <SelectItem value="Image360">360° Image</SelectItem>
                  <SelectItem value="Video2D">2D Video</SelectItem>
                  <SelectItem value="Video3D">3D Video</SelectItem>
                  <SelectItem value="Video360">360° Video</SelectItem>
                  <SelectItem value="Audio">Audio</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isUploading}
              />
            </div>
            
            <div className="grid grid-cols-1 gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isUploading}
              />
            </div>
            
            {isUploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-2" />
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!selectedFile || !mediaType || !name || isUploading}>
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" /> Upload
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
