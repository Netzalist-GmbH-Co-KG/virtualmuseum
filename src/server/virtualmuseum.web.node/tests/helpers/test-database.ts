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

        const tables = ['InventoryItems', 'Rooms', 'Tenants'];
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
            )`
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

            await this.db.exec('COMMIT');
            console.log('Seeded test data successfully');
        } catch (error) {
            await this.db.exec('ROLLBACK');
            console.error('Error seeding test data:', error);
            throw error;
        }
    }
}
