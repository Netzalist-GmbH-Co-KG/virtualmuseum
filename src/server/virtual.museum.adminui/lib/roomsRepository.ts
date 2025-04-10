import { withDb } from './db';
import { Room, RoomWithRelations, InventoryItem, TopographicalTable, TopographicalTableTopic } from './types';

/**
 * Repository for room-related database operations
 */
export const roomsRepository = {
  /**
   * Get all rooms with optional related data
   * @param includeInventoryItems Whether to include inventory items
   * @param includeTenant Whether to include tenant information
   * @returns Array of rooms with requested relations
   */
  getAllRooms(includeInventoryItems = false, includeTenant = false): RoomWithRelations[] {
    return withDb(db => {
      // Get all rooms
      const rooms = db.prepare('SELECT * FROM Rooms').all() as Room[];
      
      if (!rooms.length) return [];
      
      const roomsWithRelations: RoomWithRelations[] = rooms.map(room => {
        const result: RoomWithRelations = { ...room };
        
        // Include tenant information if requested
        if (includeTenant) {
          const tenant = db.prepare('SELECT * FROM Tenants WHERE Id = ?').get(room.TenantId);
          if (tenant) {
            result.Tenant = tenant;
          }
        }
        
        // Include inventory items if requested
        if (includeInventoryItems) {
          const inventoryItems = db.prepare('SELECT * FROM InventoryItems WHERE RoomId = ?').all(room.Id) as InventoryItem[];
          result.InventoryItems = inventoryItems;
        }
        
        return result;
      });
      
      return roomsWithRelations;
    });
  },
  
  /**
   * Get a single room by ID with optional related data
   * @param id Room ID
   * @param includeInventoryItems Whether to include inventory items
   * @param includeTenant Whether to include tenant information
   * @returns Room with requested relations or null if not found
   */
  getRoomById(id: string, includeInventoryItems = false, includeTenant = false): RoomWithRelations | null {
    return withDb(db => {
      // Get the room
      const room = db.prepare('SELECT * FROM Rooms WHERE Id = ?').get(id) as Room | undefined;
      
      if (!room) return null;
      
      const result: RoomWithRelations = { ...room };
      
      // Include tenant information if requested
      if (includeTenant) {
        const tenant = db.prepare('SELECT * FROM Tenants WHERE Id = ?').get(room.TenantId);
        if (tenant) {
          result.Tenant = tenant;
        }
      }
      
      // Include inventory items if requested
      if (includeInventoryItems) {
        const inventoryItems = db.prepare('SELECT * FROM InventoryItems WHERE RoomId = ?').all(room.Id) as InventoryItem[];
        result.InventoryItems = inventoryItems;
      }
      
      return result;
    });
  },
  
  /**
   * Get inventory items for a room
   * @param roomId Room ID
   * @returns Array of inventory items
   */
  getInventoryItemsByRoomId(roomId: string): InventoryItem[] {
    return withDb(db => {
      return db.prepare('SELECT * FROM InventoryItems WHERE RoomId = ?').all(roomId) as InventoryItem[];
    });
  },
  
  /**
   * Get topographical table by inventory item ID
   * @param inventoryItemId Inventory item ID
   * @returns Topographical table or null if not found
   */
  getTopographicalTableByInventoryItemId(inventoryItemId: string): TopographicalTable | null {
    return withDb(db => {
      return db.prepare('SELECT * FROM TopographicalTables WHERE Id = ?').get(inventoryItemId) as TopographicalTable | null;
    });
  },
  
  /**
   * Get topics for a topographical table
   * @param topographicalTableId Topographical table ID
   * @returns Array of topics
   */
  getTopicsByTopographicalTableId(topographicalTableId: string): TopographicalTableTopic[] {
    return withDb(db => {
      return db.prepare('SELECT * FROM TopographicalTableTopics WHERE TopographicalTableId = ?').all(topographicalTableId) as TopographicalTableTopic[];
    });
  }
};
