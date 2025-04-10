"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface LinkTimeSeriesDialogProps {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  searchTerm: string
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>
  selectedTimeSeries: string[]
  handleTimeSeriesCheckboxChange: (timeSeriesId: string) => void
  handleLinkTimeSeries: () => void
  filteredTimeSeries: any[]
}

export function LinkTimeSeriesDialog({
  isOpen,
  setIsOpen,
  searchTerm,
  setSearchTerm,
  selectedTimeSeries,
  handleTimeSeriesCheckboxChange,
  handleLinkTimeSeries,
  filteredTimeSeries,
}: LinkTimeSeriesDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Link Time Series</DialogTitle>
          <DialogDescription>
            Select time series to link to this topic. You can select multiple time series.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center gap-2 border rounded-md px-3 py-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search time series..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>

          <ScrollArea className="h-[300px] rounded-md border p-4">
            <div className="space-y-4">
              {filteredTimeSeries.length > 0 ? (
                filteredTimeSeries.map((series) => (
                  <div key={series.id} className="flex items-start space-x-3 py-2">
                    <Checkbox
                      id={`timeseries-${series.id}`}
                      checked={selectedTimeSeries.includes(series.id)}
                      onCheckedChange={() => handleTimeSeriesCheckboxChange(series.id)}
                    />
                    <div className="grid gap-1.5 leading-none">
                      <label
                        htmlFor={`timeseries-${series.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {series.name}
                      </label>
                      <p className="text-sm text-muted-foreground">{series.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {series.geoEventGroupsCount} groups, {series.geoEventsCount} events
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground">No time series found</div>
              )}
            </div>
          </ScrollArea>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleLinkTimeSeries} disabled={selectedTimeSeries.length === 0}>
            Link Selected Time Series
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
