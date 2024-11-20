import sqlite3 from 'sqlite3';
import { Database, open } from 'sqlite';
import { TenantWithRooms, RoomWithInventory } from '../types/dto/tenant.dto';
import { TimeSeriesWithEvents } from '../types/dto/timeseries.dto';
import { BaseService } from './base.service';
import { MultimediaPresentationWithPresentationItems } from '@/types/dto/multimediapresentation.dt';

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
                    room.InventoryItems = inventoryItems;
                }
                tenant.Rooms = rooms;
            }

            return tenants;
        } catch (error) {
            console.error('Error in getTenants:', error);
            throw error;
        }
    }

    async getTimeSeriesWithEvents(): Promise<TimeSeriesWithEvents[]> {
        try {
            if (!this.db) {
                throw new Error('Database not initialized');
            }

            console.log('Executing getTimeSeriesWithEvents query...');

            // First get all time series
            const timeSeries = await this.db.all<TimeSeriesWithEvents[]>(`
                SELECT * FROM TimeSeries
            `);
            
            // For each time series, get their GeoEventGroups and GeoEvents
            for (const series of timeSeries) {
                const geoEventGroups = await this.db.all(`
                    SELECT * FROM GeoEventGroups 
                    WHERE TimeSeriesId = ?
                `, series.Id);

                for (const group of geoEventGroups) {
                    const geoEvents = await this.db.all(`
                        SELECT 
                            Id,
                            GeoEventGroupId,
                            MultimediaPresentationId,
                            Label,
                            Description,
                            DateTime,
                            Latitude,
                            Longitude
                        FROM GeoEvents 
                        WHERE GeoEventGroupId = ?
                    `, group.Id);
                    
                    group.GeoEvents = geoEvents;
                }
                
                series.GeoEventGroups = geoEventGroups;
            }

            return timeSeries;
        } catch (error) {
            console.error('Failed to get time series with events:', error);
            throw error;
        }
    }

    async getMultimediaPresentations(): Promise<any[]> {
        try {
            if (!this.db) {
                throw new Error('Database not initialized');
            }

            console.log('Executing getMultimediaPresentations query...');

            // First get all multimedia presentations
            const multimediaPresentations = await this.db.all<MultimediaPresentationWithPresentationItems[]>(`
                SELECT * FROM MultimediaPresentations
            `);
            
            // For each multimedia presentation, get their PresentationItems and MediaFiles 
            for (const presentation of multimediaPresentations) {
                const presentationItems = await this.db.all(`
                    SELECT * FROM PresentationItems 
                    WHERE MultimediaPresentationId = ?
                `, presentation.Id);

                for (const item of presentationItems) {
                    const mediafiles = await this.db.all(`
                        SELECT * FROM MediaFiles 
                        WHERE Id = ?
                    `, item.MediaFileId);
                    item.MediaFile = mediafiles[0];
                }
                
                presentation.PresentationItems = presentationItems;                
            }

            return multimediaPresentations;
        } catch (error) {
            console.error('Failed to get multimedia presentations:', error);
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
