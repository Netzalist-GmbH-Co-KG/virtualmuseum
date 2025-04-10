"use client"

import React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, AlertCircle } from "lucide-react"
import Link from "next/link"
import { PresentationDetailsForm } from "../components/PresentationDetailsForm"
import { TimelineEditor } from "../components/presentation-editor/timeline-editor"
import { Presentation } from "../types"
import { convertAppPresentationToEditorPresentation, convertEditorPresentationToAppPresentation } from "../components/presentation-editor/types"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"

// Empty presentation template for loading state
const emptyPresentation: Presentation = {
  id: "",
  name: "",
  description: "",
  presentationItems: []
}



export default function PresentationDetailPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  // Unwrap params with React.use() for Next.js 15+
  const unwrappedParams = 'then' in params ? React.use(params) : params;
  const { id } = unwrappedParams;
  
  const [presentation, setPresentation] = useState<Presentation>(emptyPresentation)
  const [availableMediaFiles, setAvailableMediaFiles] = useState<any[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMedia, setIsLoadingMedia] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  // Fetch presentation data when component mounts or ID changes
  useEffect(() => {
    const fetchPresentation = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        const response = await fetch(`/api/presentations/${id}/get-with-items`)
        
        if (!response.ok) {
          throw new Error(`Failed to fetch presentation: ${response.statusText}`)
        }
        
        const data = await response.json()
        setPresentation(data)
      } catch (err) {
        console.error('Error fetching presentation:', err)
        setError(err instanceof Error ? err.message : 'Failed to load presentation')
      } finally {
        setIsLoading(false)
      }
    }
    
    if (id) {
      fetchPresentation()
    }
  }, [id])
  
  // Fetch available media files when component mounts
  useEffect(() => {
    const fetchMediaFiles = async () => {
      setIsLoadingMedia(true)
      
      try {
        const response = await fetch('/api/media')
        
        if (!response.ok) {
          throw new Error(`Failed to fetch media files: ${response.statusText}`)
        }
        
        const data = await response.json()
        setAvailableMediaFiles(data.mediaFiles || [])
      } catch (err) {
        console.error('Error fetching media files:', err)
        toast({
          title: "Failed to load media files",
          description: err instanceof Error ? err.message : "An unknown error occurred",
          variant: "destructive"
        })
      } finally {
        setIsLoadingMedia(false)
      }
    }
    
    fetchMediaFiles()
  }, [])
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setPresentation((prev) => ({ ...prev, [name]: value }))
  }

  const handleSequenceChange = (itemId: string, value: number) => {
    setPresentation((prev) => ({
      ...prev,
      presentationItems: prev.presentationItems.map((item) =>
        item.id === itemId ? { ...item, sequenceNumber: value } : item,
      ),
    }))
  }

  const handleDurationChange = (itemId: string, value: number) => {
    setPresentation((prev) => ({
      ...prev,
      presentationItems: prev.presentationItems.map((item) =>
        item.id === itemId ? { ...item, durationInSeconds: value } : item,
      ),
    }))
  }

  const handleMoveItem = (itemId: string, direction: 'up' | 'down') => {
    // Implementation for moving items up/down in sequence
    console.log(`Move item ${itemId} ${direction}`)
  }

  const handleDeleteItem = (itemId: string) => {
    // Implementation for deleting items
    console.log(`Delete item ${itemId}`)
  }

  const handleAddItem = () => {
    // Implementation for adding new items
    console.log('Add new item')
  }

  const handleSave = async () => {
    setIsSaving(true)
    
    try {
      const response = await fetch(`/api/presentations/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: presentation.name,
          description: presentation.description,
          presentationItems: presentation.presentationItems
        }),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Failed to save presentation: ${response.statusText}`)
      }
      
      const updatedPresentation = await response.json()
      setPresentation(updatedPresentation)
      
      toast({
        title: "Success",
        description: "Presentation saved successfully",
      })
    } catch (err) {
      console.error('Error saving presentation:', err)
      setError(err instanceof Error ? err.message : 'Failed to save presentation')
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to save presentation",
        variant: "destructive"
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center gap-2">
          <Link href="/presentations">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h2 className="text-3xl font-bold tracking-tight">Loading presentation...</h2>
        </div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center gap-2">
          <Link href="/presentations">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h2 className="text-3xl font-bold tracking-tight">Error</h2>
        </div>
        
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Failed to load presentation</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
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
          <PresentationDetailsForm
            name={presentation.name}
            description={presentation.description}
            onInputChange={handleInputChange}
            onSave={handleSave}
            isSaving={isSaving}
          />
        </TabsContent>

        <TabsContent value="items" className="space-y-4">
          <TimelineEditor
            key={`timeline-editor-${Date.now()}`} // Use timestamp to force re-render on every state change
            presentation={convertAppPresentationToEditorPresentation(presentation)}
            availableMediaFiles={availableMediaFiles}
            onPresentationChange={(updatedPresentation) => {
              // Convert the editor presentation back to app presentation format
              const updatedAppPresentation = convertEditorPresentationToAppPresentation(updatedPresentation);
              
              // Update the state with the converted presentation
              setPresentation(updatedAppPresentation);
            }}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
