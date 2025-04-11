import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Edit, Film, MoreHorizontal, Trash2 } from "lucide-react";

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

interface GeoEventCardProps {
  event: GeoEvent;
  onEdit: (event: GeoEvent) => void;
  onDelete: (eventId: string) => void;
  onViewPresentation?: (presentationId: string) => void;
}

export function GeoEventCard({ 
  event, 
  onEdit, 
  onDelete, 
  onViewPresentation 
}: GeoEventCardProps) {
  return (
    <Card className="hover:bg-accent/50 transition-colors">
      <CardContent className="p-4 flex items-start justify-between">
        <div className="space-y-1">
          <div className="font-medium">{event.name}</div>
          <div className="text-sm text-muted-foreground">{event.description}</div>
          <div className="text-xs text-muted-foreground">
            {new Date(event.dateTime).toLocaleDateString()} | Lat: {event.latitude.toFixed(4)},
            Long: {event.longitude.toFixed(4)}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {(event.hasMultimediaPresentation || event.multimediaPresentationId) && (
            <div className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full flex items-center gap-1">
              <Film className="h-3 w-3" />
              Has Presentation
            </div>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(event)}>
                <Edit className="mr-2 h-4 w-4" /> Edit Event
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(event.id)}>
                <Trash2 className="mr-2 h-4 w-4" /> Delete Event
              </DropdownMenuItem>
              {event.hasMultimediaPresentation && event.multimediaPresentationId && (
                <DropdownMenuItem onClick={() => onViewPresentation?.(event.multimediaPresentationId!)}>
                  <Film className="mr-2 h-4 w-4" /> View Presentation
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}
