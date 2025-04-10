import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DoorOpen, Clock, Film, FileImage } from "lucide-react"
import Link from "next/link"

export default function Dashboard() {
  const stats = [
    {
      title: "Rooms",
      value: "5",
      description: "Museum spaces & inventory",
      icon: DoorOpen,
      href: "/rooms",
    },
    {
      title: "Time Series",
      value: "8",
      description: "Historical sequences",
      icon: Clock,
      href: "/time-series",
    },
    {
      title: "Presentations",
      value: "15",
      description: "Multimedia shows",
      icon: Film,
      href: "/presentations",
    },
    {
      title: "Media Files",
      value: "42",
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
