import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react"
import Link from "next/link"

// Mock data for time series
const timeSeries = [
  {
    id: "1",
    name: "World War II Timeline",
    description: "Major events during World War II (1939-1945)",
    geoEventGroupsCount: 5,
    geoEventsCount: 18,
  },
  {
    id: "2",
    name: "Industrial Revolution",
    description: "Key developments during the Industrial Revolution (1760-1840)",
    geoEventGroupsCount: 3,
    geoEventsCount: 12,
  },
  {
    id: "3",
    name: "Space Exploration",
    description: "Major milestones in human space exploration (1957-Present)",
    geoEventGroupsCount: 4,
    geoEventsCount: 15,
  },
  {
    id: "4",
    name: "Ancient Civilizations",
    description: "Rise and fall of major ancient civilizations",
    geoEventGroupsCount: 6,
    geoEventsCount: 24,
  },
  {
    id: "5",
    name: "Climate Change",
    description: "Significant climate events and policy developments",
    geoEventGroupsCount: 3,
    geoEventsCount: 9,
  },
  {
    id: "6",
    name: "Medical Breakthroughs",
    description: "Important discoveries and advances in medicine",
    geoEventGroupsCount: 4,
    geoEventsCount: 16,
  },
  {
    id: "7",
    name: "Digital Revolution",
    description: "Evolution of computing and the internet",
    geoEventGroupsCount: 3,
    geoEventsCount: 12,
  },
  {
    id: "8",
    name: "Art Movements",
    description: "Major art movements throughout history",
    geoEventGroupsCount: 5,
    geoEventsCount: 20,
  },
]

export default function TimeSeriesPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Time Series</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Create Time Series
        </Button>
      </div>

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
    </div>
  )
}
