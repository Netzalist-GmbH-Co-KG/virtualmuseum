import { InventoryItem, Room, Tenant } from '../';

export interface RoomWithInventory extends Room {
    InventoryItems: InventoryItem[];
}

export interface TenantWithRooms extends Tenant {
    Rooms: RoomWithInventory[];
}
