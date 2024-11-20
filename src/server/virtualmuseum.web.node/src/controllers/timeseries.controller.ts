import { Request, Response } from 'express';
import { DatabaseService } from '../services/database.service';

/**
 * @swagger
 * tags:
 *   name: TimeSeries
 *   description: Time series management endpoints
 */
export class TimeSeriesController {
    constructor(private dbService: DatabaseService) {}

    /**
     * @swagger
     * /timeseries:
     *   get:
     *     summary: Get all time series with their events
     *     tags: [TimeSeries]
     *     security:
     *       - ApiKeyAuth: []
     *     responses:
     *       200:
     *         description: List of time series with their events
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/TimeSeriesWithEvents'
     *       500:
     *         description: Server error
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
     */
    async getTimeSeries(req: Request, res: Response): Promise<void> {
        try {
            const timeSeries = await this.dbService.getTimeSeriesWithEvents();
            res.json(timeSeries);
        } catch (error) {
            console.error('Error getting time series:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}
