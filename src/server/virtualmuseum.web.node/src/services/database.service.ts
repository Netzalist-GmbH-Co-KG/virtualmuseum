import sqlite3 from 'sqlite3';
import { Database, open } from 'sqlite';
import { TenantWithRooms, RoomWithInventory } from '../types/dto/tenant.dto';
import { BaseService } from './base.service';

export class DatabaseService extends BaseService {
    private db: Database | null = null;
    private readonly dbPath: string;

    constructor(dbPath: string) {
        super();
        this.dbPath = dbPath;
    }

    async initialize(): Promise<void> {
        if (!this.db) {
            this.db = await open({
                filename: this.dbPath,
                driver: sqlite3.Database
            });
        }
    }

    async getTenants(): Promise<TenantWithRooms[]> {
        if (!this.db) {
            throw new Error('Database not initialized');
        }

        // First get all tenants
        const tenants = await this.db.all<TenantWithRooms[]>('SELECT * FROM Tenants');
        
        // For each tenant, get their rooms and inventory items
        for (const tenant of tenants) {
            const rooms = await this.db.all<RoomWithInventory[]>(
                'SELECT * FROM Rooms WHERE TenantId = ?',
                tenant.Id
            );

            // For each room, get inventory items
            for (const room of rooms) {
                const inventoryItems = await this.db.all(
                    'SELECT * FROM InventoryItems WHERE RoomId = ?',
                    room.Id
                );
                room.inventoryItems = inventoryItems;
            }
            tenant.rooms = rooms;
        }

        return tenants;
    }

    async close(): Promise<void> {
        if (this.db) {
            await this.db.close();
            this.db = null;
        }
    }
}
