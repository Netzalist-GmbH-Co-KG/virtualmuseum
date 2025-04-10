"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Save } from "lucide-react"

interface PresentationDetailsFormProps {
  name: string
  description: string
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
}

export function PresentationDetailsForm({
  name,
  description,
  onInputChange
}: PresentationDetailsFormProps) {
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
            <Input
              id="name"
              name="name"
              value={name}
              onChange={onInputChange}
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
              value={description}
              onChange={onInputChange}
              className="col-span-3"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
