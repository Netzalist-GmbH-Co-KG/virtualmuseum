import request from 'supertest';
import { App } from '../../../src/app';
import { TestDatabaseService } from '../../helpers/test-database';

describe('MultimediaPresentationRouter', () => {
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

    describe('GET /api/multimediapresentations', () => {
        it('should return 401 when API key is missing', async () => {
            const response = await request(app.getApp())
                .get('/api/multimediapresentations');
            
            expect(response.status).toBe(401);
            expect(response.body).toEqual({ error: 'Unauthorized' });
        });

        it('should return 401 when API key is invalid', async () => {
            const response = await request(app.getApp())
                .get('/api/multimediapresentations')
                .set('x-api-key', 'invalid-key');
            
            expect(response.status).toBe(401);
            expect(response.body).toEqual({ error: 'Unauthorized' });
        });

        it('should return multimedia presentations with presentation items when API key is valid', async () => {
            const response = await request(app.getApp())
                .get('/api/multimediapresentations')
                .set('x-api-key', 'test-api-key');
            
            expect(response.status).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBe(1);

            const presentation = response.body[0];
            expect(presentation).toMatchObject({
                Id: 'test-presentation-1',
                Name: 'Test Presentation 1',
                Description: 'Test Presentation Description 1',
                PresentationItems: expect.arrayContaining([
                    expect.objectContaining({
                        Id: 'test-item-1',
                        MultimediaPresentationId: 'test-presentation-1',
                        MediaFileId: 'test-media-1',
                        SlotNumber: 1,
                        SequenceNumber: 1,
                        DurationInSeconds: 60,
                        MediaFile: expect.objectContaining({
                            Id: 'test-media-1',
                            Name: 'Test Media 1',
                            Description: 'Test Media Description 1',
                            Type: 0,
                            DurationInSeconds: 60,
                            FileName: 'test1.jpg',
                            Url: 'http://test.com/test1.jpg'
                        })
                    }),
                    expect.objectContaining({
                        Id: 'test-item-2',
                        MultimediaPresentationId: 'test-presentation-1',
                        MediaFileId: 'test-media-2',
                        SlotNumber: 2,
                        SequenceNumber: 2,
                        DurationInSeconds: 120,
                        MediaFile: expect.objectContaining({
                            Id: 'test-media-2',
                            Name: 'Test Media 2',
                            Description: 'Test Media Description 2',
                            Type: 1,
                            DurationInSeconds: 120,
                            FileName: 'test2.mp4',
                            Url: 'http://test.com/test2.mp4'
                        })
                    })
                ])
            });
        });
    });
});
