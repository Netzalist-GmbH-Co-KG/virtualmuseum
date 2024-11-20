import { DatabaseService } from '../../../src/services/database.service';
import { TimeSeriesWithEvents } from '../../../src/types/dto/timeseries.dto';
import { TestDatabaseService } from '../../helpers/test-database';
import path from 'path';

describe('DatabaseService', () => {
    let dbService: DatabaseService;
    const testDbPath = path.join(__dirname, '../../test.db');

    beforeEach(async () => {
        dbService = new TestDatabaseService();
        await dbService.initialize();
    });

    afterEach(async () => {
        await dbService.close();
    });

    describe('getTimeSeriesWithEvents', () => {
        it('should return time series with geo event groups and events', async () => {
            const result = await dbService.getTimeSeriesWithEvents();
            
            expect(Array.isArray(result)).toBe(true);
            if (result.length > 0) {
                const timeSeries = result[0];
                expect(timeSeries).toHaveProperty('Id');
                expect(timeSeries).toHaveProperty('Name');
                expect(timeSeries).toHaveProperty('Description');
                expect(timeSeries).toHaveProperty('GeoEventGroups');
                expect(Array.isArray(timeSeries.GeoEventGroups)).toBe(true);

                if (timeSeries.GeoEventGroups.length > 0) {
                    const group = timeSeries.GeoEventGroups[0];
                    expect(group).toHaveProperty('Id');
                    expect(group).toHaveProperty('Label');
                    expect(group).toHaveProperty('TimeSeriesId');
                    expect(group).toHaveProperty('GeoEvents');
                    expect(Array.isArray(group.GeoEvents)).toBe(true);

                    if (group.GeoEvents.length > 0) {
                        const event = group.GeoEvents[0];
                        expect(event).toHaveProperty('Id');
                        expect(event).toHaveProperty('GeoEventGroupId');
                        expect(event).toHaveProperty('MultimediaPresentationId');
                        expect(event).toHaveProperty('Label');
                        expect(event).toHaveProperty('DateTime');
                        expect(event).toHaveProperty('Latitude');
                        expect(event).toHaveProperty('Longitude');
                    }
                }
            }
        });
    });
});
