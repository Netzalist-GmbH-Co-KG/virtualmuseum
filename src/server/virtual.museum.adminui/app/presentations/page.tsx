"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Plus, LinkIcon, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"

// Define presentation interface
interface Presentation {
  id: string;
  name: string;
  description: string;
  itemsCount: number;
  usageCount: number;
}

export default function PresentationsPage() {
  const { toast } = useToast()
  const [presentations, setPresentations] = useState<Presentation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch presentations from the API
  useEffect(() => {
    const fetchPresentations = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        const response = await fetch('/api/presentations')
        
        if (!response.ok) {
          throw new Error(`Error fetching presentations: ${response.status} ${response.statusText}`)
        }
        
        const data = await response.json()
        setPresentations(data)
      } catch (error) {
        console.error('Error fetching presentations:', error)
        setError(error instanceof Error ? error.message : 'An unknown error occurred')
        toast({
          title: 'Error',
          description: error instanceof Error ? error.message : 'Failed to load presentations',
          variant: 'destructive',
        })
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchPresentations()
  }, [toast])

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Multimedia Presentations</h2>
        <Link href="/presentations/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Create Presentation
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <div className="p-4 border rounded-md bg-destructive/10 text-destructive">
          <p>{error}</p>
          <Button 
            variant="outline" 
            className="mt-2" 
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      ) : presentations.length === 0 ? (
        <div className="p-8 text-center border rounded-md bg-muted/50">
          <h3 className="text-lg font-medium mb-2">No presentations found</h3>
          <p className="text-muted-foreground mb-4">Create your first multimedia presentation to get started.</p>
          <Link href="/presentations/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Create Presentation
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {presentations.map((presentation) => (
            <Link href={`/presentations/${presentation.id}`} key={presentation.id}>
              <Card className={`hover:bg-accent/50 transition-colors cursor-pointer h-full ${presentation.usageCount === 0 ? 'border-dashed' : ''}`}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle>{presentation.name}</CardTitle>
                    {presentation.usageCount > 0 ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
                        <LinkIcon className="h-3 w-3" /> In use
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-gray-50 text-gray-500 border-gray-200 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" /> Unused
                      </Badge>
                    )}
                  </div>
                  <CardDescription>
                    <div className="flex flex-col gap-1 mt-1">
                      <div>{presentation.itemsCount} {presentation.itemsCount === 1 ? 'media item' : 'media items'}</div>
                      <div className={presentation.usageCount > 0 ? 'text-green-700' : ''}>
                        Used in {presentation.usageCount} {presentation.usageCount === 1 ? 'GeoEvent' : 'GeoEvents'}
                      </div>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{presentation.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
