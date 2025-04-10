import React from "react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Edit, Plus, Trash2 } from "lucide-react";
import { GeoEventCard } from "./GeoEventCard";

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

interface GeoEventGroup {
  id: string;
  label: string;
  description: string;
  geoEvents: GeoEvent[];
}

interface GeoEventGroupsTabProps {
  groups: GeoEventGroup[];
  onAddGroup: () => void;
  onEditGroup: (groupId: string) => void;
  onDeleteGroup: (groupId: string) => void;
  onAddEvent: (groupId: string) => void;
  onEditEvent: (event: GeoEvent) => void;
  onDeleteEvent: (eventId: string) => void;
  onViewPresentation?: (presentationId: string) => void;
}

export function GeoEventGroupsTab({
  groups,
  onAddGroup,
  onEditGroup,
  onDeleteGroup,
  onAddEvent,
  onEditEvent,
  onDeleteEvent,
  onViewPresentation
}: GeoEventGroupsTabProps) {
  return (
    <>
      <div className="flex justify-between">
        <h3 className="text-lg font-medium">Geo Event Groups</h3>
        <Button onClick={onAddGroup}>
          <Plus className="mr-2 h-4 w-4" /> Add Group
        </Button>
      </div>

      <Accordion type="multiple" className="w-full">
        {groups.map((group) => (
          <AccordionItem value={group.id} key={group.id}>
            <AccordionTrigger className="hover:bg-accent/50 px-4 rounded-md">
              <div className="flex items-center justify-between w-full pr-4">
                <div className="font-medium">{group.label}</div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{group.geoEvents.length} events</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEditGroup(group.id)}>
                        <Edit className="mr-2 h-4 w-4" /> Edit Group
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDeleteGroup(group.id)}>
                        <Trash2 className="mr-2 h-4 w-4" /> Delete Group
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="p-4 space-y-4">
                <p className="text-sm text-muted-foreground">{group.description}</p>

                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-medium">Geo Events</h4>
                  <Button size="sm" onClick={() => onAddEvent(group.id)}>
                    <Plus className="mr-2 h-3 w-3" /> Add Event
                  </Button>
                </div>

                <div className="space-y-2">
                  {group.geoEvents.map((event) => (
                    <GeoEventCard
                      key={event.id}
                      event={event}
                      onEdit={onEditEvent}
                      onDelete={onDeleteEvent}
                      onViewPresentation={onViewPresentation}
                    />
                  ))}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </>
  );
}
