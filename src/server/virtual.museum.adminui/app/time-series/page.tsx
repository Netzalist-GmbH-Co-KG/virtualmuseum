"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react"
import Link from "next/link"

interface TimeSeries {
  id: string
  name: string
  description: string
  geoEventGroupsCount: number
  geoEventsCount: number
}

export default function TimeSeriesPage() {
  const [timeSeries, setTimeSeries] = useState<TimeSeries[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTimeSeries = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        const response = await fetch('/api/time-series')
        
        if (!response.ok) {
          throw new Error(`Error fetching time series: ${response.status} ${response.statusText}`)
        }
        
        const data = await response.json()
        setTimeSeries(data.timeSeries)
      } catch (err) {
        console.error('Failed to fetch time series:', err)
        setError(err instanceof Error ? err.message : 'Failed to load time series')
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchTimeSeries()
  }, [])

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Time Series</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Create Time Series
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <span className="ml-2">Loading time series...</span>
        </div>
      ) : error ? (
        <div className="bg-destructive/15 text-destructive p-4 rounded-md">
          <p>Error: {error}</p>
          <Button variant="outline" className="mt-2" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      ) : timeSeries.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No time series found</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {timeSeries.map((series) => (
            <Link href={`/time-series/${series.id}`} key={series.id}>
              <Card className="hover:bg-accent/50 transition-colors cursor-pointer h-full">
                <CardHeader>
                  <CardTitle>{series.name}</CardTitle>
                  <CardDescription>
                    {series.geoEventGroupsCount} groups, {series.geoEventsCount} events
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{series.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}