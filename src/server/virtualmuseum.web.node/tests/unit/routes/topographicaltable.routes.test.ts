import request from 'supertest';
import { App } from '../../../src/app';
import { TestDatabaseService } from '../../helpers/test-database';
import { TopographicalTableWithTopics } from '../../../src/types/dto/topographicaltable.dto';

describe('TopographicalTableRouter', () => {
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

    describe('GET /api/v1/topographicaltables/:tableId', () => {
        it('should return 401 when API key is missing', async () => {
            const response = await request(app.getApp())
                .get('/api/v1/topographicaltables/test-table-1');
            
            expect(response.status).toBe(401);
            expect(response.body).toEqual({ error: 'Unauthorized' });
        });

        it('should return 401 when API key is invalid', async () => {
            const response = await request(app.getApp())
                .get('/api/v1/topographicaltables/test-table-1')
                .set('x-api-key', 'invalid-key');
            
            expect(response.status).toBe(401);
            expect(response.body).toEqual({ error: 'Unauthorized' });
        });

        it('should return 404 when table does not exist', async () => {
            const response = await request(app.getApp())
                .get('/api/v1/topographicaltables/non-existent-table')
                .set('x-api-key', 'test-api-key');
            
            expect(response.status).toBe(404);
            expect(response.body).toEqual({ error: 'Topographical table not found' });
        });

        it('should return topographical table with topics when API key is valid', async () => {
            const response = await request(app.getApp())
                .get('/api/v1/topographicaltables/test-table-1')
                .set('x-api-key', 'test-api-key');
            
            expect(response.status).toBe(200);
            
            const table: TopographicalTableWithTopics = response.body;
            expect(table).toMatchSnapshot();
        });
    });
});
