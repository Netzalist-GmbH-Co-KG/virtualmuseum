import { z } from 'zod';

/**
 * Room entity schema
 */
export const RoomSchema = z.object({
  Id: z.string().uuid(),
  TenantId: z.string().uuid(),
  Label: z.string().nullable(),
  Description: z.string().nullable(),
});

/**
 * Room type with strong typing
 */
export type Room = z.infer<typeof RoomSchema>;

/**
 * Inventory item type enum
 */
export enum InventoryType {
  TopographicalTable = 0,
}

/**
 * Inventory item entity schema
 */
export const InventoryItemSchema = z.object({
  Id: z.string().uuid(),
  RoomId: z.string().uuid(),
  Name: z.string().nullable(),
  Description: z.string().nullable(),
  InventoryType: z.nativeEnum(InventoryType),
  PositionX: z.number(),
  PositionY: z.number(),
  PositionZ: z.number(),
  RotationX: z.number(),
  RotationY: z.number(),
  RotationZ: z.number(),
  ScaleX: z.number(),
  ScaleY: z.number(),
  ScaleZ: z.number(),
});

/**
 * Inventory item type with strong typing
 */
export type InventoryItem = z.infer<typeof InventoryItemSchema>;

/**
 * Topographical table entity schema
 */
export const TopographicalTableSchema = z.object({
  Id: z.string().uuid(),
});

/**
 * Topographical table type with strong typing
 */
export type TopographicalTable = z.infer<typeof TopographicalTableSchema>;

/**
 * Topographical table topic entity schema
 */
export const TopographicalTableTopicSchema = z.object({
  Id: z.string().uuid(),
  TopographicalTableId: z.string().uuid(),
  Topic: z.string(),
  Description: z.string(),
  MediaFileImage2DId: z.string().uuid().nullable(),
});

/**
 * Topographical table topic type with strong typing
 */
export type TopographicalTableTopic = z.infer<typeof TopographicalTableTopicSchema>;

/**
 * Tenant entity schema
 */
export const TenantSchema = z.object({
  Id: z.string().uuid(),
  Name: z.string(),
});

/**
 * Tenant type with strong typing
 */
export type Tenant = z.infer<typeof TenantSchema>;

/**
 * Room with related data
 */
export interface RoomWithRelations extends Room {
  Tenant?: Tenant;
  InventoryItems?: InventoryItem[];
}

/**
 * Inventory item with related data
 */
export interface InventoryItemWithRelations extends InventoryItem {
  Room?: Room;
  TopographicalTable?: TopographicalTableWithRelations;
}

/**
 * Topographical table with related data
 */
export interface TopographicalTableWithRelations extends TopographicalTable {
  Topics?: TopographicalTableTopic[];
}

/**
 * API response for rooms list
 */
export interface RoomsResponse {
  rooms: RoomWithRelations[];
}

/**
 * API response for a single room
 */
export interface RoomResponse {
  room: RoomWithRelations;
}

/**
 * API response for inventory items list
 */
export interface InventoryItemsResponse {
  inventoryItems: InventoryItemWithRelations[];
}

/**
 * API response for a single inventory item
 */
export interface InventoryItemResponse {
  inventoryItem: InventoryItemWithRelations;
}

/**
 * Schema for updating an inventory item
 */
export const InventoryItemUpdateSchema = z.object({
  Name: z.string().nullable(),
  Description: z.string().nullable(),
  PositionX: z.number(),
  PositionY: z.number(),
  PositionZ: z.number(),
  RotationX: z.number(),
  RotationY: z.number(),
  RotationZ: z.number(),
  ScaleX: z.number(),
  ScaleY: z.number(),
  ScaleZ: z.number(),
});

/**
 * Type for inventory item update data
 */
export type InventoryItemUpdate = z.infer<typeof InventoryItemUpdateSchema>;

/**
 * API error response
 */
export interface ErrorResponse {
  error: string;
  status: number;
  validationErrors?: z.ZodIssue[];
}
