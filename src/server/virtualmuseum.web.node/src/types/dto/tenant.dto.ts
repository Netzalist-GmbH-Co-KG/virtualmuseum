import { InventoryItem, Room, Tenant } from '../';

export interface RoomWithInventory extends Room {
    inventoryItems: InventoryItem[];
}

export interface TenantWithRooms extends Tenant {
    rooms: RoomWithInventory[];
}
