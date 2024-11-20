import { Database } from 'sqlite';
import { DatabaseService } from '../../src/services/database.service';

export class TestDatabaseService extends DatabaseService {
    constructor() {
        super(':memory:');
    }

    async initialize(): Promise<void> {
        await super.initialize();
        if (this.db) {
            await this.dropTables();
            await this.createTestSchema();
            await this.seedTestData();
        }
    }

    async reset(): Promise<void> {
        await this.dropTables();
        await this.createTestSchema();
        await this.seedTestData();
    }

    async clearData(): Promise<void> {
        await this.dropTables();
        await this.createTestSchema();
    }

    protected async dropTables(): Promise<void> {
        if (!this.db) return;

        const tables = [
            'InventoryItems', 
            'Rooms', 
            'Tenants', 
            'GeoEvents', 
            'GeoEventGroups', 
            'TimeSeries',
            'PresentationItems',
            'MultimediaPresentations',
            'MediaFiles'
        ];
        for (const table of tables) {
            await this.db.exec(`DROP TABLE IF EXISTS ${table}`);
        }
        console.log('Dropped existing tables');
    }

    protected async createTestSchema(): Promise<void> {
        if (!this.db) return;

        const queries = [
            `CREATE TABLE IF NOT EXISTS Tenants (
                Id TEXT PRIMARY KEY,
                Name TEXT NOT NULL
            )`,
            `CREATE TABLE IF NOT EXISTS Rooms (
                Id TEXT PRIMARY KEY,
                TenantId TEXT NOT NULL,
                Label TEXT,
                Description TEXT,
                FOREIGN KEY (TenantId) REFERENCES Tenants(Id)
            )`,
            `CREATE TABLE IF NOT EXISTS InventoryItems (
                Id TEXT PRIMARY KEY,
                RoomId TEXT NOT NULL,
                Name TEXT,
                Description TEXT,
                InventoryType INTEGER NOT NULL,
                PositionX REAL NOT NULL DEFAULT 0,
                PositionY REAL NOT NULL DEFAULT 0,
                PositionZ REAL NOT NULL DEFAULT 0,
                RotationX REAL NOT NULL DEFAULT 0,
                RotationY REAL NOT NULL DEFAULT 0,
                RotationZ REAL NOT NULL DEFAULT 0,
                ScaleX REAL NOT NULL DEFAULT 1,
                ScaleY REAL NOT NULL DEFAULT 1,
                ScaleZ REAL NOT NULL DEFAULT 1,
                FOREIGN KEY (RoomId) REFERENCES Rooms(Id)
            )`,
            `CREATE TABLE IF NOT EXISTS TimeSeries (
                Id TEXT PRIMARY KEY,
                Name TEXT NOT NULL,
                Description TEXT NOT NULL
            )`,
            `CREATE TABLE IF NOT EXISTS GeoEventGroups (
                Id TEXT PRIMARY KEY,
                Label TEXT,
                Description TEXT,
                TimeSeriesId TEXT NOT NULL,
                FOREIGN KEY (TimeSeriesId) REFERENCES TimeSeries(Id)
            )`,
            `CREATE TABLE IF NOT EXISTS GeoEvents (
                Id TEXT PRIMARY KEY,
                GeoEventGroupId TEXT NOT NULL,
                MultimediaPresentationId TEXT,
                Label TEXT,
                Description TEXT,
                DateTime TEXT NOT NULL,
                Latitude REAL NOT NULL,
                Longitude REAL NOT NULL,
                FOREIGN KEY (GeoEventGroupId) REFERENCES GeoEventGroups(Id)
            )`,
            `CREATE TABLE IF NOT EXISTS MediaFiles (
                Id TEXT PRIMARY KEY,
                Description TEXT NULL,
                DurationInSeconds REAL NOT NULL,
                FileName TEXT NULL,
                Name TEXT NULL,
                Type INTEGER NOT NULL,
                Url TEXT NULL
            )`,
            `CREATE TABLE IF NOT EXISTS MultimediaPresentations (
                Id TEXT PRIMARY KEY,
                Name TEXT NULL,
                Description TEXT NULL
            )`,
            `CREATE TABLE IF NOT EXISTS PresentationItems (
                Id TEXT PRIMARY KEY,
                MultimediaPresentationId TEXT NOT NULL,
                MediaFileId TEXT NULL,
                SlotNumber INTEGER NOT NULL,
                SequenceNumber INTEGER NOT NULL,
                DurationInSeconds INTEGER NOT NULL,
                FOREIGN KEY (MultimediaPresentationId) REFERENCES MultimediaPresentations(Id),
                FOREIGN KEY (MediaFileId) REFERENCES MediaFiles(Id)
            )`,
        ];

        for (const query of queries) {
            await this.db.exec(query);
        }
        console.log('Created test schema');
    }

    protected async seedTestData(): Promise<void> {
        if (!this.db) return;

        try {
            // Use transactions for atomic operations
            await this.db.exec('BEGIN TRANSACTION');

            // Insert test tenant
            await this.db.run(
                'INSERT INTO Tenants (Id, Name) VALUES (?, ?)',
                'test-tenant-1',
                'Test Museum'
            );

            // Insert test room
            await this.db.run(
                'INSERT INTO Rooms (Id, TenantId, Label, Description) VALUES (?, ?, ?, ?)',
                'test-room-1',
                'test-tenant-1',
                'Test Room',
                'A test room'
            );

            // Insert test inventory item
            await this.db.run(
                `INSERT INTO InventoryItems (
                    Id, RoomId, Name, Description, InventoryType,
                    PositionX, PositionY, PositionZ,
                    RotationX, RotationY, RotationZ,
                    ScaleX, ScaleY, ScaleZ
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                'test-item-1',
                'test-room-1',
                'Test Item',
                'A test item',
                1,
                0, 0, 0,
                0, 0, 0,
                1, 1, 1
            );

            // Add TimeSeries test data
            await this.db.run(
                'INSERT INTO TimeSeries (Id, Name, Description) VALUES (?, ?, ?)',
                'test-timeseries-1',
                'Test TimeSeries',
                'A test time series'
            );

            // Add GeoEventGroup test data
            await this.db.run(
                'INSERT INTO GeoEventGroups (Id, Label, Description, TimeSeriesId) VALUES (?, ?, ?, ?)',
                'test-group-1',
                'Test Group',
                'A test group',
                'test-timeseries-1'
            );

            // Add GeoEvent test data
            await this.db.run(
                'INSERT INTO GeoEvents (Id, GeoEventGroupId, MultimediaPresentationId, Label, Description, DateTime, Latitude, Longitude) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                'test-event-1',
                'test-group-1',
                null,
                'Test Event',
                'A test event',
                '2024-01-01T00:00:00Z',
                0, 0
            );

            // Seed multimedia presentation test data
            await this.db?.run(
                `INSERT INTO MediaFiles (Id, Name, Description, Type, DurationInSeconds, FileName, Url) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                ['test-media-1', 'Test Media 1', 'Test Media Description 1', 0, 60, 'test1.jpg', 'http://test.com/test1.jpg']
            );
            await this.db?.run(
                `INSERT INTO MediaFiles (Id, Name, Description, Type, DurationInSeconds, FileName, Url) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`,
                ['test-media-2', 'Test Media 2', 'Test Media Description 2', 1, 120, 'test2.mp4', 'http://test.com/test2.mp4']
            );

            await this.db?.run(
                `INSERT INTO MultimediaPresentations (Id, Name, Description) 
                 VALUES (?, ?, ?)`,
                ['test-presentation-1', 'Test Presentation 1', 'Test Presentation Description 1']
            );

            await this.db?.run(
                `INSERT INTO PresentationItems (Id, MultimediaPresentationId, MediaFileId, SlotNumber, SequenceNumber, DurationInSeconds) 
                 VALUES (?, ?, ?, ?, ?, ?)`,
                ['test-item-1', 'test-presentation-1', 'test-media-1', 1, 1, 60]
            );
            await this.db?.run(
                `INSERT INTO PresentationItems (Id, MultimediaPresentationId, MediaFileId, SlotNumber, SequenceNumber, DurationInSeconds) 
                 VALUES (?, ?, ?, ?, ?, ?)`,
                ['test-item-2', 'test-presentation-1', 'test-media-2', 2, 2, 120]
            );

            await this.db.exec('COMMIT');
            console.log('Seeded test data successfully');
        } catch (error) {
            await this.db.exec('ROLLBACK');
            console.error('Error seeding test data:', error);
            throw error;
        }
    }
}
