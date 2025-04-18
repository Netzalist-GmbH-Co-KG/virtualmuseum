"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DoorOpen, Clock, Film, FileImage } from "lucide-react"
import Link from "next/link"

export default function Dashboard() {
  const [roomCount, setRoomCount] = useState<number | null>(null);
  const [timeSeriesCount, setTimeSeriesCount] = useState<number | null>(null);
  const [presentationsCount, setPresentationsCount] = useState<number | null>(null);
  const [mediaFilesCount, setMediaFilesCount] = useState<number | null>(null);
  
  // Fetch room count from the API
  useEffect(() => {
    const fetchRoomCount = async () => {
      try {
        const response = await fetch('/api/rooms');
        if (response.ok) {
          const data = await response.json();
          setRoomCount(data.rooms?.length || 0);
        }
      } catch (error) {
        console.error('Failed to fetch room count:', error);
      }
    };
    
    fetchRoomCount();
  }, []);
  
  // Fetch time series count from the API
  useEffect(() => {
    const fetchTimeSeriesCount = async () => {
      try {
        const response = await fetch('/api/time-series');
        if (response.ok) {
          const data = await response.json();
          setTimeSeriesCount(data.timeSeries?.length || 0);
        }
      } catch (error) {
        console.error('Failed to fetch time series count:', error);
      }
    };
    
    fetchTimeSeriesCount();
  }, []);
  
  // Fetch media files count from the API
  useEffect(() => {
    const fetchMediaFilesCount = async () => {
      try {
        const response = await fetch('/api/media');
        if (response.ok) {
          const data = await response.json();
          setMediaFilesCount(data.mediaFiles?.length || 0);
        }
      } catch (error) {
        console.error('Failed to fetch media files count:', error);
      }
    };
    
    fetchMediaFilesCount();
  }, []);
  
  // Fetch presentations count from the API
  useEffect(() => {
    const fetchPresentationsCount = async () => {
      try {
        const response = await fetch('/api/presentations');
        if (response.ok) {
          const data = await response.json();
          setPresentationsCount(Array.isArray(data) ? data.length : 0);
        }
      } catch (error) {
        console.error('Failed to fetch presentations count:', error);
      }
    };
    
    fetchPresentationsCount();
  }, []);
  
  const stats = [
    {
      title: "Rooms",
      value: roomCount !== null ? roomCount.toString() : "...",
      description: "Museum spaces & inventory",
      icon: DoorOpen,
      href: "/rooms",
    },
    {
      title: "Time Series",
      value: timeSeriesCount !== null ? timeSeriesCount.toString() : "...",
      description: "Historical sequences",
      icon: Clock,
      href: "/time-series",
    },
    {
      title: "Presentations",
      value: presentationsCount !== null ? presentationsCount.toString() : "...",
      description: "Multimedia shows",
      icon: Film,
      href: "/presentations",
    },
    {
      title: "Media Files",
      value: mediaFilesCount !== null ? mediaFilesCount.toString() : "...",
      description: "Images, videos & audio",
      icon: FileImage,
      href: "/media",
    },
  ]

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        {stats.map((stat) => (
          <Link href={stat.href} key={stat.title}>
            <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <Card className="col-span-full md:col-span-2">
          <CardHeader>
            <CardTitle>TimeGlideVR Museum Management</CardTitle>
            <CardDescription>Administrative interface for managing VR museum content</CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Welcome to the TimeGlideVR Museum Management System. This interface allows museum staff to edit time
              series data and multimedia presentations for the VR application.
            </p>
            <p className="mt-4">
              Use the navigation menu to access different sections of the application. You can manage rooms and their
              inventory, time series, presentations, and media files.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Quick Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              <li>Create rooms first, then add inventory items to them</li>
              <li>Create time series before adding geo events</li>
              <li>Upload media files before creating presentations</li>
              <li>Remember that Slot 0 is for audio only</li>
              <li>Slot 1 is for 360° content</li>
              <li>Slots 2+ are for flat displays</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
