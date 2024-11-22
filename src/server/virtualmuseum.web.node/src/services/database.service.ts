import sqlite3 from 'sqlite3';
import { Database, open } from 'sqlite';
import { TenantWithRooms, RoomWithInventory } from '../types/dto/tenant.dto';
import { TimeSeriesWithEvents } from '../types/dto/timeseries.dto';
import { MultimediaPresentationWithPresentationItems } from '@/types/dto/multimediapresentation.dt';
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

    async getTopographicalTableWithTopics(tableId: string): Promise<any> {
        try {
            if (!this.db) {
                throw new Error('Database not initialized');
            }

            console.log('Executing getTopographicalTableWithTopics query for tableId:', tableId);

            // First get the table
            const table = await this.db.get(`
                SELECT * FROM TopographicalTables WHERE Id = ?
            `, tableId);

            if (!table) {
                return null;
            }

            // Get topics for the table
            const topics = await this.db.all(`
                SELECT * FROM TopographicalTableTopics
                WHERE TopographicalTableId = ?
            `, tableId);

            // For each topic, get the associated time series
            for (const topic of topics) {
                // Get time series IDs through the junction table
                const timeSeriesIds = await this.db.all(`
                    SELECT DISTINCT TimeSeriesId FROM TopographicalTableTopicTimeSeries
                    WHERE TopographicalTableTopicId = ?
                `, topic.Id);

                // Get full time series data for each ID
                const timeSeries = [];
                for (const { TimeSeriesId } of timeSeriesIds) {
                    // Get the time series
                    const series = await this.db.get(`
                        SELECT * FROM TimeSeries
                        WHERE Id = ?
                    `, TimeSeriesId);

                    if (series) {
                        // Get geo event groups for this time series
                        const geoEventGroups = await this.db.all(`
                            SELECT * FROM GeoEventGroups 
                            WHERE TimeSeriesId = ?
                        `, series.Id);

                        // For each group, get its geo events
                        for (const group of geoEventGroups) {
                            const geoEvents = await this.db.all(`
                                SELECT * FROM GeoEvents 
                                WHERE GeoEventGroupId = ?
                            `, group.Id);

                            // For each event with a multimedia presentation, get the full presentation data
                            for (const event of geoEvents) {
                                if (event.MultimediaPresentationId) {
                                    // Get the multimedia presentation
                                    const presentation = await this.db.get(`
                                        SELECT * FROM MultimediaPresentations
                                        WHERE Id = ?
                                    `, event.MultimediaPresentationId);

                                    if (presentation) {
                                        // Get presentation items
                                        const presentationItems = await this.db.all(`
                                            SELECT * FROM PresentationItems 
                                            WHERE MultimediaPresentationId = ?
                                            ORDER BY SequenceNumber
                                        `, presentation.Id);

                                        // Get media files for each presentation item
                                        for (const item of presentationItems) {
                                            if (item.MediaFileId) {
                                                const mediaFile = await this.db.get(`
                                                    SELECT * FROM MediaFiles 
                                                    WHERE Id = ?
                                                `, item.MediaFileId);
                                                item.MediaFile = mediaFile;
                                            }
                                        }

                                        presentation.PresentationItems = presentationItems;
                                        event.MultimediaPresentation = presentation;
                                    }
                                }
                            }

                            group.GeoEvents = geoEvents;
                        }

                        series.GeoEventGroups = geoEventGroups;
                        timeSeries.push(series);
                    }
                }

                topic.TimeSeries = timeSeries;
            }

            table.Topics = topics;
            return table;

        } catch (error) {
            console.error('Failed to get topographical table with topics:', error);
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
