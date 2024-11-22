import { Request, Response } from 'express';
import { DatabaseService } from '../services/database.service';

/**
 * @swagger
 * tags:
 *   name: TopographicalTable
 *   description: TopographicalTable management endpoints
 */
export class TopographicalTableController {
    constructor(private dbService: DatabaseService) {}

    /**
     * @swagger
     * /topographicaltables/{tableId}:
     *   get:
     *     summary: Get a topographical table with its topics and time series
     *     tags: [TopographicalTable]
     *     security:
     *       - ApiKeyAuth: []
     *     parameters:
     *       - in: path
     *         name: tableId
     *         required: true
     *         schema:
     *           type: string
     *     responses:
     *       200:
     *         description: a topographical table with its topics and time series
     *         content:
     *           application/json:
     *             schema:
     *               $ref: '#/components/schemas/TopographicalTableWithTopics'
     *       404:
     *         description: Topographical table not found
     *         content:
     *           application/json:
     *             schema:
     *               type: object
     *               properties:
     *                 error:
     *                   type: string
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
    async getTopographicalTable(req: Request, res: Response): Promise<void> {
        try {
            const  topographicalTable = await this.dbService.getTopographicalTableWithTopics(req.params.tableId);
            if (!topographicalTable) {
                res.status(404).json({ error: 'Topographical table not found' });
            } else {
                res.json(topographicalTable);
            }
        } catch (error) {
            console.error('Error getting topographical table:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}
