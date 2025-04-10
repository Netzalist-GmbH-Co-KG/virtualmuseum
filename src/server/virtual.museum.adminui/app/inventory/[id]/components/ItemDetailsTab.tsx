"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Save } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ItemDetailsTabProps {
  inventoryItem: any
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  setInventoryItem: React.Dispatch<React.SetStateAction<any>>
}

export function ItemDetailsTab({ inventoryItem, handleInputChange, setInventoryItem }: ItemDetailsTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Inventory Item Information</CardTitle>
        <CardDescription>Edit the details of this inventory item</CardDescription>
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
              value={inventoryItem.name}
              onChange={handleInputChange}
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
              value={inventoryItem.description}
              onChange={handleInputChange}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="inventoryType" className="text-right">
              Item Type
            </Label>
            <Select
              value={inventoryItem.inventoryType}
              onValueChange={(value) => setInventoryItem((prev: any) => ({ ...prev, inventoryType: value }))}
            >
              <SelectTrigger id="inventoryType" className="col-span-3">
                <SelectValue placeholder="Select item type" />
              </SelectTrigger>
              <SelectContent>
                {inventoryItem.inventoryTypeOptions.map((option: any) => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="room" className="text-right">
              Room
            </Label>
            <Select
              value={inventoryItem.roomId}
              onValueChange={(value) => setInventoryItem((prev: any) => ({ ...prev, roomId: value }))}
            >
              <SelectTrigger id="room" className="col-span-3">
                <SelectValue placeholder="Select room" />
              </SelectTrigger>
              <SelectContent>
                {inventoryItem.roomOptions.map((option: any) => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button className="w-full sm:w-auto">
          <Save className="mr-2 h-4 w-4" /> Save Changes
        </Button>
      </CardContent>
    </Card>
  )
}
