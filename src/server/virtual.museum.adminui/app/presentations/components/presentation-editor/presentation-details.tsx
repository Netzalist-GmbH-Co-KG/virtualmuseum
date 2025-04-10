"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Save } from "lucide-react"
import type { Presentation } from "./types"

interface PresentationDetailsProps {
  presentation: Presentation
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}

export function PresentationDetails({ presentation, onInputChange }: PresentationDetailsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Presentation Information</CardTitle>
        <CardDescription>Edit the details of this multimedia presentation</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" name="name" value={presentation.name} onChange={onInputChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              name="description"
              value={presentation.description}
              onChange={onInputChange}
              className="col-span-3"
            />
          </div>
        </div>
        <Button className="w-full sm:w-auto">
          <Save className="mr-2 h-4 w-4" /> Save Changes
        </Button>
      </CardContent>
    </Card>
  )
}
