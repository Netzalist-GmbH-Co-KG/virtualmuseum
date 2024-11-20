import sqlite3 from 'sqlite3';
import { Database, open } from 'sqlite';
import { TenantWithRooms, RoomWithInventory } from '../types/dto/tenant.dto';
import { BaseService } from './base.service';

export class DatabaseService extends BaseService {
    protected db: Database | null = null;
    private readonly dbPath: string;

    constructor(dbPath: string) {
        super();
        this.dbPath = dbPath;
    }

    async initialize(): Promise<void> {
        try {
            console.log('Initializing database with path:', this.dbPath);
            
            if (!this.db) {
                this.db = await open({
                    filename: this.dbPath,
                    driver: sqlite3.Database
                });
                console.log('Database connection established');
            }
        } catch (error) {
            console.error('Failed to initialize database:', error);
            throw error;
        }
    }

    async getTenants(): Promise<TenantWithRooms[]> {
        try {
            if (!this.db) {
                throw new Error('Database not initialized');
            }

            console.log('Executing getTenants query...');

            // First get all tenants
            const tenants = await this.db.all<TenantWithRooms[]>(`
                SELECT * FROM Tenants
            `);
            console.log('Retrieved tenants:', tenants);
            
            // For each tenant, get their rooms and inventory items
            for (const tenant of tenants) {
                const rooms = await this.db.all<RoomWithInventory[]>(
                    'SELECT * FROM Rooms WHERE TenantId = ?',
                    tenant.Id
                );
                console.log(`Retrieved rooms for tenant ${tenant.Id}:`, rooms);

                // For each room, get inventory items
                for (const room of rooms) {
                    const inventoryItems = await this.db.all(
                        'SELECT * FROM InventoryItems WHERE RoomId = ?',
                        room.Id
                    );
                    console.log(`Retrieved inventory items for room ${room.Id}:`, inventoryItems);
                    room.inventoryItems = inventoryItems;
                }
                tenant.rooms = rooms;
            }

            return tenants;
        } catch (error) {
            console.error('Error in getTenants:', error);
            throw error;
        }
    }

    async close(): Promise<void> {
        try {
            if (this.db) {
                await this.db.close();
                this.db = null;
                console.log('Database connection closed');
            }
        } catch (error) {
            console.error('Error closing database connection:', error);
            throw error;
        }
    }
}
