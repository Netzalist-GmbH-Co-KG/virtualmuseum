"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Save } from "lucide-react"

import { InventoryItem } from './types'

interface PositionScaleTabProps {
  inventoryItem: InventoryItem
  handlePositionChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleRotationChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleScaleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleSaveChanges?: () => Promise<void>
}

export function PositionScaleTab({
  inventoryItem,
  handlePositionChange,
  handleRotationChange,
  handleScaleChange,
  handleSaveChanges,
}: PositionScaleTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Position, Rotation & Scale</CardTitle>
        <CardDescription>Configure the spatial properties of this item</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Position</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="position.x">X Position</Label>
                <Input
                  id="position.x"
                  name="position.x"
                  type="number"
                  step="0.1"
                  value={inventoryItem.position.x}
                  onChange={handlePositionChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position.y">Y Position</Label>
                <Input
                  id="position.y"
                  name="position.y"
                  type="number"
                  step="0.1"
                  value={inventoryItem.position.y}
                  onChange={handlePositionChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position.z">Z Position</Label>
                <Input
                  id="position.z"
                  name="position.z"
                  type="number"
                  step="0.1"
                  value={inventoryItem.position.z}
                  onChange={handlePositionChange}
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Rotation (degrees)</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rotation.x">X Rotation</Label>
                <Input
                  id="rotation.x"
                  name="rotation.x"
                  type="number"
                  step="1"
                  value={inventoryItem.rotation.x}
                  onChange={handleRotationChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rotation.y">Y Rotation</Label>
                <Input
                  id="rotation.y"
                  name="rotation.y"
                  type="number"
                  step="1"
                  value={inventoryItem.rotation.y}
                  onChange={handleRotationChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rotation.z">Z Rotation</Label>
                <Input
                  id="rotation.z"
                  name="rotation.z"
                  type="number"
                  step="1"
                  value={inventoryItem.rotation.z}
                  onChange={handleRotationChange}
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-2">Scale</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="scale.x">X Scale</Label>
                <Input
                  id="scale.x"
                  name="scale.x"
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={inventoryItem.scale.x}
                  onChange={handleScaleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="scale.y">Y Scale</Label>
                <Input
                  id="scale.y"
                  name="scale.y"
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={inventoryItem.scale.y}
                  onChange={handleScaleChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="scale.z">Z Scale</Label>
                <Input
                  id="scale.z"
                  name="scale.z"
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={inventoryItem.scale.z}
                  onChange={handleScaleChange}
                />
              </div>
            </div>
          </div>
        </div>
        <Button 
          className="w-full sm:w-auto" 
          onClick={handleSaveChanges ? () => handleSaveChanges() : undefined}
        >
          <Save className="mr-2 h-4 w-4" /> Save Changes
        </Button>
      </CardContent>
    </Card>
  )
}
