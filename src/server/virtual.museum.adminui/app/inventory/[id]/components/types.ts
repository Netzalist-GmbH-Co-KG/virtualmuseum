// Common types used across the inventory item components

export interface Position3D {
  x: number
  y: number
  z: number
}

export interface TimeSeries {
  id: string
  name: string
  description: string
  geoEventGroupsCount: number
  geoEventsCount: number
}

export interface Topic {
  id: string
  topic: string
  description: string
  mediaFileImage2DId: string
  mediaFileImage2DUrl: string
  timeSeries: TimeSeries[]
}

export interface TopographicalTable {
  id: string
  topics: Topic[]
}

export interface Option {
  id: string
  name: string
}

export interface InventoryItem {
  id: string
  name: string
  description: string
  inventoryType: string
  roomId: string
  roomName: string
  position: Position3D
  rotation: Position3D
  scale: Position3D
  topographicalTable: TopographicalTable
  roomOptions: Option[]
  inventoryTypeOptions: Option[]
}
