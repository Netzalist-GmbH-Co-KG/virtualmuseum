import request from 'supertest';
import { App } from '../../../src/app';
import { TestDatabaseService } from '../../helpers/test-database';

describe('TenantRouter', () => {
    let app: App;
    let dbService: TestDatabaseService;

    beforeAll(async () => {
        process.env.NODE_ENV = 'test';
        process.env.API_KEY = 'test-api-key';
        
        // Setup test database
        dbService = new TestDatabaseService();
        await dbService.initialize();

        // Create and initialize app instance with test database
        app = new App(dbService);
        await app.initialize();

        console.log('Test setup complete');
    });

    beforeEach(async () => {
        await dbService.reset();
    });

    afterAll(async () => {
        await app.close();
        console.log('Test cleanup complete');
    });

    describe('GET /api/v1/tenants', () => {
        it('should return 401 when API key is missing', async () => {
            const response = await request(app.getApp())
                .get('/api/v1/tenants');
            
            expect(response.status).toBe(401);
            expect(response.body).toEqual({ error: 'Unauthorized' });
        });

        it('should return 401 when API key is invalid', async () => {
            const response = await request(app.getApp())
                .get('/api/v1/tenants')
                .set('x-api-key', 'invalid-key');
            
            expect(response.status).toBe(401);
            expect(response.body).toEqual({ error: 'Unauthorized' });
        });

        it('should return tenants with rooms and inventory items when API key is valid', async () => {
            const response = await request(app.getApp())
                .get('/api/v1/tenants')
                .set('x-api-key', process.env.API_KEY || '');
            
            if (response.status !== 200) {
                console.error('Response error:', response.body);
            }
            
            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            
            const [tenant] = response.body;
            expect(tenant).toMatchSnapshot();
        });

        it('should return empty array when no tenants exist', async () => {
            // Clear all data but keep schema
            await dbService.clearData();

            const response = await request(app.getApp())
                .get('/api/v1/tenants')
                .set('x-api-key', process.env.API_KEY || '');
            
            expect(response.status).toBe(200);
            expect(response.body).toEqual([]);
        });
    });
});
