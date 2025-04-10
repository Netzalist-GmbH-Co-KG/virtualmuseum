"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Save, Trash2, Clock } from "lucide-react"
import Link from "next/link"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface TopicsTabProps {
  inventoryItem: any
  handleTopicChange: (topicId: string, field: string, value: string) => void
  setIsAddTopicDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
  openLinkTimeSeriesDialog: (topicId: string) => void
}

export function TopicsTab({
  inventoryItem,
  handleTopicChange,
  setIsAddTopicDialogOpen,
  openLinkTimeSeriesDialog,
}: TopicsTabProps) {
  return (
    <>
      <div className="flex justify-between">
        <h3 className="text-lg font-medium">Topographical Table Topics</h3>
        <Button onClick={() => setIsAddTopicDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Topic
        </Button>
      </div>

      <Accordion type="multiple" className="w-full">
        {inventoryItem.topographicalTable.topics.map((topic: any) => (
          <AccordionItem value={topic.id} key={topic.id}>
            <AccordionTrigger className="hover:bg-accent/50 px-4 rounded-md">
              <div className="flex items-center justify-between w-full pr-4">
                <div className="font-medium">{topic.topic}</div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{topic.timeSeries.length} time series</span>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="p-4 space-y-4">
                <div className="grid gap-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor={`topic-${topic.id}`} className="text-right">
                      Topic Name
                    </Label>
                    <Input
                      id={`topic-${topic.id}`}
                      value={topic.topic}
                      onChange={(e) => handleTopicChange(topic.id, "topic", e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor={`description-${topic.id}`} className="text-right">
                      Description
                    </Label>
                    <Textarea
                      id={`description-${topic.id}`}
                      value={topic.description}
                      onChange={(e) => handleTopicChange(topic.id, "description", e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label className="text-right pt-2">Topic Image</Label>
                    <div className="col-span-3 flex items-center gap-4">
                      <div className="relative w-24 h-24 border rounded-md overflow-hidden">
                        <img
                          src={topic.mediaFileImage2DUrl || "/placeholder.svg"}
                          alt={topic.topic}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <Button variant="outline">Change Image</Button>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-medium">Time Series</h4>
                    <Button size="sm" onClick={() => openLinkTimeSeriesDialog(topic.id)}>
                      <Clock className="mr-2 h-4 w-4" /> Link Time Series
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {topic.timeSeries.map((series: any) => (
                      <Link href={`/time-series/${series.id}`} key={series.id}>
                        <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
                          <CardContent className="p-4">
                            <div className="space-y-1">
                              <div className="font-medium">{series.name}</div>
                              <div className="text-sm text-muted-foreground">{series.description}</div>
                              <div className="text-xs text-muted-foreground">
                                {series.geoEventGroupsCount} groups, {series.geoEventsCount} events
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="destructive" size="sm">
                    <Trash2 className="mr-2 h-4 w-4" /> Delete Topic
                  </Button>
                  <Button size="sm">
                    <Save className="mr-2 h-4 w-4" /> Save Topic
                  </Button>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </>
  )
}
