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

// API response interfaces
export interface ApiInventoryItem {
  Id: string
  RoomId: string
  Name: string | null
  Description: string | null
  InventoryType: number
  PositionX: number
  PositionY: number
  PositionZ: number
  RotationX: number
  RotationY: number
  RotationZ: number
  ScaleX: number
  ScaleY: number
  ScaleZ: number
}

export interface ApiRoom {
  Id: string
  TenantId: string
  Label: string | null
  Description: string | null
}

export interface ApiTopographicalTable {
  Id: string
}

export interface ApiTimeSeries {
  Id: string
  Name: string
  Description: string | null
  GeoEventGroupsCount: number
  GeoEventsCount: number
}

export interface ApiTopic {
  Id: string
  TopographicalTableId: string
  Topic: string
  Description: string
  MediaFileImage2DId: string | null
  TimeSeries?: ApiTimeSeries[]
}

export interface ApiInventoryResponse {
  inventoryItem: ApiInventoryItem
  room: ApiRoom
  topographicalTable: ApiTopographicalTable | null
  topics: ApiTopic[] | null
}
