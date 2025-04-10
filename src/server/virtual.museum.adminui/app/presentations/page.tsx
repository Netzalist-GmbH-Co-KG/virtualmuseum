import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react"
import Link from "next/link"

// Mock data for multimedia presentations
const presentations = [
  {
    id: "1",
    name: "Pearl Harbor Attack",
    description: "Multimedia presentation about the attack on Pearl Harbor",
    itemsCount: 5,
  },
  {
    id: "2",
    name: "Moon Landing",
    description: "The historic Apollo 11 mission and first steps on the moon",
    itemsCount: 7,
  },
  {
    id: "3",
    name: "Industrial Revolution in Britain",
    description: "Key innovations and social changes during the Industrial Revolution",
    itemsCount: 4,
  },
  {
    id: "4",
    name: "Fall of the Berlin Wall",
    description: "Events leading to and following the fall of the Berlin Wall",
    itemsCount: 6,
  },
  {
    id: "5",
    name: "Ancient Rome: Daily Life",
    description: "Exploration of daily life in ancient Rome",
    itemsCount: 8,
  },
  {
    id: "6",
    name: "Climate Change: Global Impact",
    description: "Visual presentation of climate change effects worldwide",
    itemsCount: 5,
  },
]

export default function PresentationsPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Multimedia Presentations</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Create Presentation
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {presentations.map((presentation) => (
          <Link href={`/presentations/${presentation.id}`} key={presentation.id}>
            <Card className="hover:bg-accent/50 transition-colors cursor-pointer h-full">
              <CardHeader>
                <CardTitle>{presentation.name}</CardTitle>
                <CardDescription>{presentation.itemsCount} media items</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{presentation.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
