import request from 'supertest';
import express from 'express';
import { TestDatabaseService } from '../../helpers/test-database';
import { TimeSeriesRouter } from '../../../src/routes/timeseries.routes';

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
        const timeSeriesRouter = new TimeSeriesRouter(dbService);
        app.use('/api/timeseries', timeSeriesRouter.getRouter());
        await dbService.reset();
    });

    afterAll(async () => {
        await dbService.close();
        console.log('Test cleanup complete');
    });

    describe('GET /api/timeseries', () => {
        it('should return all time series with their geo event groups and events', async () => {
            const response = await request(app).get('/api/timeseries');
            
            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);

            if (response.body.length > 0) {
                const timeSeries = response.body[0];
                expect(timeSeries).toHaveProperty('Id', 'test-timeseries-1');
                expect(timeSeries).toHaveProperty('Name', 'Test TimeSeries');
                expect(timeSeries).toHaveProperty('Description', 'A test time series');
                expect(timeSeries).toHaveProperty('GeoEventGroups');
                expect(Array.isArray(timeSeries.GeoEventGroups)).toBe(true);

                if (timeSeries.GeoEventGroups.length > 0) {
                    const group = timeSeries.GeoEventGroups[0];
                    expect(group).toHaveProperty('Id', 'test-group-1');
                    expect(group).toHaveProperty('Label', 'Test Group');
                    expect(group).toHaveProperty('Description', 'A test group');
                    expect(group).toHaveProperty('TimeSeriesId', 'test-timeseries-1');
                    expect(group).toHaveProperty('GeoEvents');
                    expect(Array.isArray(group.GeoEvents)).toBe(true);

                    if (group.GeoEvents.length > 0) {
                        const event = group.GeoEvents[0];
                        expect(event).toHaveProperty('Id', 'test-event-1');
                        expect(event).toHaveProperty('GeoEventGroupId', 'test-group-1');
                        expect(event).toHaveProperty('Label', 'Test Event');
                        expect(event).toHaveProperty('Description', 'A test event');
                        expect(event).toHaveProperty('DateTime', '2024-01-01T00:00:00Z');
                        expect(event).toHaveProperty('Latitude', 0);
                        expect(event).toHaveProperty('Longitude', 0);
                        expect(event).not.toHaveProperty('multimediaPresentation');
                    }
                }
            }
        });

        it('should return an empty array when no time series exist', async () => {
            await dbService.clearData();
            const response = await request(app).get('/api/timeseries');
            
            expect(response.status).toBe(200);
            expect(response.body).toEqual([]);
        });
    });
});
