import request from 'supertest';
import express from 'express';
import { TestDatabaseService } from '../../helpers/test-database';
import { ApiV1Router } from '../../../src/routes/apiv1.routes';

describe('TimeSeriesRouter', () => {
    let app: express.Application;
    let dbService: TestDatabaseService;

    beforeAll(async () => {
        dbService = new TestDatabaseService();
        await dbService.initialize();
        console.log('Test setup complete');
    });

    beforeEach(async () => {
        app = express();
        app.use(express.json());
        const apiV1Router = new ApiV1Router(dbService);
        app.use('/api/v1/', apiV1Router.getRouter());
        await dbService.reset();
    });

    afterAll(async () => {
        await dbService.close();
        console.log('Test cleanup complete');
    });

    describe('GET /api/v1/timeseries', () => {
        it('should return all time series with their geo event groups and events', async () => {
            const response = await request(app).get('/api/v1/timeseries');
            
            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);

            const timeSeries = response.body[0];
            expect(timeSeries).toMatchSnapshot();
        });

        it('should return an empty array when no time series exist', async () => {
            await dbService.clearData();
            const response = await request(app).get('/api/v1/timeseries');
            
            expect(response.status).toBe(200);
            expect(response.body).toEqual([]);
        });
    });
});
