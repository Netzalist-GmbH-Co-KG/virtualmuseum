"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ImageIcon } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface AddTopicDialogProps {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  newTopic: {
    topic: string
    description: string
    mediaFileImage2DId: string
    mediaFileImage2DUrl: string
  }
  handleNewTopicChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  handleAddTopic: () => void
}

export function AddTopicDialog({
  isOpen,
  setIsOpen,
  newTopic,
  handleNewTopicChange,
  handleAddTopic,
}: AddTopicDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Topic</DialogTitle>
          <DialogDescription>
            Create a new topic for this topographical table. You can link time series to it after creation.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="topic-name" className="text-right">
              Topic Name
            </Label>
            <Input
              id="topic-name"
              name="topic"
              value={newTopic.topic}
              onChange={handleNewTopicChange}
              placeholder="Enter topic name"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="topic-description" className="text-right">
              Description
            </Label>
            <Textarea
              id="topic-description"
              name="description"
              value={newTopic.description}
              onChange={handleNewTopicChange}
              placeholder="Enter topic description"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label className="text-right pt-2">Topic Image</Label>
            <div className="col-span-3">
              <div className="flex items-center gap-4 mb-4">
                <div className="relative w-24 h-24 border rounded-md overflow-hidden bg-muted">
                  <img
                    src={newTopic.mediaFileImage2DUrl || "/placeholder.svg"}
                    alt="Topic preview"
                    className="object-cover w-full h-full"
                  />
                </div>
                <Button variant="outline">
                  <ImageIcon className="mr-2 h-4 w-4" /> Select Image
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Select an image from the media library to represent this topic.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddTopic}>Create Topic</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
