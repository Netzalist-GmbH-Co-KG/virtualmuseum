import { withDb } from './db';
import { Room, RoomWithRelations, InventoryItem, TopographicalTable, TopographicalTableTopic, InventoryType } from './types';
import { v4 as uuidv4 } from 'uuid';

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
        // Create a properly typed RoomWithRelations object
        const result: RoomWithRelations = { 
          ...room
        };
        
        // Include tenant information if requested
        if (includeTenant) {
          const tenant = db.prepare('SELECT * FROM Tenants WHERE Id = ?').get(room.TenantId) as { Id: string, Name: string };
          if (tenant) {
            // Ensure tenant has the required properties
            result.Tenant = {
              Id: tenant.Id,
              Name: tenant.Name
            };
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
        const tenant = db.prepare('SELECT * FROM Tenants WHERE Id = ?').get(room.TenantId) as { Id: string, Name: string };
        if (tenant) {
          // Ensure tenant has the required properties
          result.Tenant = {
            Id: tenant.Id,
            Name: tenant.Name
          };
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
   * Get a single inventory item by ID
   * @param id Inventory item ID
   * @returns Inventory item or null if not found
   */
  getInventoryItemById(id: string): InventoryItem | null {
    return withDb(db => {
      return db.prepare('SELECT * FROM InventoryItems WHERE Id = ?').get(id) as InventoryItem | null;
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
  },
  
  /**
   * Create a new inventory item
   * @param inventoryItem Inventory item data
   * @returns The created inventory item
   */
  createInventoryItem(inventoryItem: Omit<InventoryItem, 'Id'>): InventoryItem {
    return withDb(db => {
      // Generate a UUID for the new item
      const id = uuidv4();
      
      // Insert the inventory item
      const stmt = db.prepare(`
        INSERT INTO InventoryItems (
          Id, RoomId, Name, Description, InventoryType,
          PositionX, PositionY, PositionZ,
          RotationX, RotationY, RotationZ,
          ScaleX, ScaleY, ScaleZ
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      stmt.run(
        id,
        inventoryItem.RoomId,
        inventoryItem.Name,
        inventoryItem.Description,
        inventoryItem.InventoryType,
        inventoryItem.PositionX,
        inventoryItem.PositionY,
        inventoryItem.PositionZ,
        inventoryItem.RotationX,
        inventoryItem.RotationY,
        inventoryItem.RotationZ,
        inventoryItem.ScaleX,
        inventoryItem.ScaleY,
        inventoryItem.ScaleZ
      );
      
      // Return the created item
      return {
        Id: id,
        ...inventoryItem
      };
    });
  },
  
  /**
   * Create a topographical table for an inventory item
   * @param inventoryItemId ID of the inventory item
   * @returns The created topographical table
   */
  createTopographicalTable(inventoryItemId: string): TopographicalTable {
    return withDb(db => {
      // Insert the topographical table with the same ID as the inventory item
      const stmt = db.prepare('INSERT INTO TopographicalTables (Id) VALUES (?)');
      stmt.run(inventoryItemId);
      
      // Return the created table
      return {
        Id: inventoryItemId
      };
    });
  },
  
  /**
   * Create an inventory item and a topographical table in a single transaction
   * @param roomId Room ID
   * @param data Item data
   * @returns The created inventory item and topographical table
   */
  /**
   * Create an inventory item and a topographical table in a single transaction
   * Always creates a Topographical Table (InventoryType.TopographicalTable)
   * @param roomId Room ID
   * @param data Item data
   * @returns The created inventory item and topographical table
   */
  /**
   * Update an existing inventory item
   * @param id Inventory item ID
   * @param data Updated inventory item data
   * @returns The updated inventory item or null if not found
   */
  updateInventoryItem(id: string, data: {
    Name: string | null;
    Description: string | null;
    PositionX: number;
    PositionY: number;
    PositionZ: number;
    RotationX: number;
    RotationY: number;
    RotationZ: number;
    ScaleX: number;
    ScaleY: number;
    ScaleZ: number;
  }): InventoryItem | null {
    return withDb(db => {
      // Check if the inventory item exists
      const existingItem = db.prepare('SELECT * FROM InventoryItems WHERE Id = ?').get(id) as InventoryItem | null;
      
      if (!existingItem) {
        return null;
      }
      
      // Update the inventory item
      const stmt = db.prepare(`
        UPDATE InventoryItems SET
          Name = ?,
          Description = ?,
          PositionX = ?,
          PositionY = ?,
          PositionZ = ?,
          RotationX = ?,
          RotationY = ?,
          RotationZ = ?,
          ScaleX = ?,
          ScaleY = ?,
          ScaleZ = ?
        WHERE Id = ?
      `);
      
      stmt.run(
        data.Name,
        data.Description,
        data.PositionX,
        data.PositionY,
        data.PositionZ,
        data.RotationX,
        data.RotationY,
        data.RotationZ,
        data.ScaleX,
        data.ScaleY,
        data.ScaleZ,
        id
      );
      
      // Return the updated item
      return {
        ...existingItem,
        Name: data.Name,
        Description: data.Description,
        PositionX: data.PositionX,
        PositionY: data.PositionY,
        PositionZ: data.PositionZ,
        RotationX: data.RotationX,
        RotationY: data.RotationY,
        RotationZ: data.RotationZ,
        ScaleX: data.ScaleX,
        ScaleY: data.ScaleY,
        ScaleZ: data.ScaleZ
      };
    });
  },

  createInventoryItemWithTopographicalTable(roomId: string, data: {
    name: string;
    description: string;
    position: { x: number; y: number; z: number };
    rotation: { x: number; y: number; z: number };
    scale: { x: number; y: number; z: number };
  }) {
    return withDb(db => {
      // Begin transaction
      db.prepare('BEGIN').run();
      
      try {
        // Create inventory item
        const inventoryItem = this.createInventoryItem({
          RoomId: roomId,
          Name: data.name,
          Description: data.description,
          InventoryType: InventoryType.TopographicalTable,
          PositionX: data.position.x,
          PositionY: data.position.y,
          PositionZ: data.position.z,
          RotationX: data.rotation.x,
          RotationY: data.rotation.y,
          RotationZ: data.rotation.z,
          ScaleX: data.scale.x,
          ScaleY: data.scale.y,
          ScaleZ: data.scale.z
        });
        
        // Create topographical table
        const topographicalTable = this.createTopographicalTable(inventoryItem.Id);
        
        // Commit transaction
        db.prepare('COMMIT').run();
        
        return {
          inventoryItem,
          topographicalTable
        };
      } catch (error) {
        // Rollback transaction on error
        db.prepare('ROLLBACK').run();
        throw error;
      }
    });
  }
};
