import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Film, MapPin } from "lucide-react";

interface PresentationOption {
  id: string;
  name: string;
}

interface GeoEvent {
  id: string;
  name: string;
  description: string;
  dateTime: string;
  latitude: number;
  longitude: number;
  hasMultimediaPresentation: boolean;
  multimediaPresentationId: string | null;
}

interface GeoEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: GeoEvent | null;
  presentationOptions: PresentationOption[];
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onPresentationChange: (value: string) => void;
  onSave: () => void;
}

export function GeoEventDialog({
  open,
  onOpenChange,
  event,
  presentationOptions,
  onInputChange,
  onPresentationChange,
  onSave,
}: GeoEventDialogProps) {
  if (!event) return null;

  // Debug event data
  console.log('GeoEventDialog - Event data:', {
    id: event.id,
    name: event.name,
    multimediaPresentationId: event.multimediaPresentationId,
    hasMultimediaPresentation: event.hasMultimediaPresentation
  });
  
  // Debug presentation options
  console.log('GeoEventDialog - Presentation options:', presentationOptions);

  const isNewEvent = event.id.startsWith("new-");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isNewEvent ? "Add New Geo Event" : "Edit Geo Event"}</DialogTitle>
          <DialogDescription>
            {isNewEvent
              ? "Create a new geographical event for this time series"
              : "Edit the details of this geographical event"}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="event-name" className="text-right">
              Name
            </Label>
            <Input
              id="event-name"
              name="name"
              value={event.name}
              onChange={onInputChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="event-description" className="text-right">
              Description
            </Label>
            <Textarea
              id="event-description"
              name="description"
              value={event.description}
              onChange={onInputChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="event-dateTime" className="text-right">
              Date & Time
            </Label>
            <div className="col-span-3 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <Input
                id="event-dateTime"
                name="dateTime"
                type="datetime-local"
                value={new Date(event.dateTime).toISOString().slice(0, 16)}
                onChange={onInputChange}
              />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Location</Label>
            <div className="col-span-3 grid grid-cols-2 gap-2">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <Input
                  id="event-latitude"
                  name="latitude"
                  type="number"
                  step="0.0001"
                  placeholder="Latitude"
                  value={event.latitude}
                  onChange={onInputChange}
                />
              </div>
              <Input
                id="event-longitude"
                name="longitude"
                type="number"
                step="0.0001"
                placeholder="Longitude"
                value={event.longitude}
                onChange={onInputChange}
              />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="event-presentation" className="text-right">
              Presentation
            </Label>
            <div className="col-span-3 flex items-center gap-2">
              <Film className="h-4 w-4 text-muted-foreground" />
              <Select
                value={event.multimediaPresentationId ? event.multimediaPresentationId : "none"}
                onValueChange={(value) => {
                  console.log('GeoEventDialog - Presentation selected:', value);
                  onPresentationChange(value);
                }}
                defaultValue="none"
              >
                <SelectTrigger id="event-presentation" className="w-full">
                  <SelectValue placeholder="Select a presentation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {presentationOptions.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSave}>Save Event</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
