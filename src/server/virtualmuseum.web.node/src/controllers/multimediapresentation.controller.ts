import { Request, Response } from 'express';
import { DatabaseService } from '../services/database.service';

/**
 * @swagger
 * tags:
 *   name: MultimediaPresentations
 *   description: MultimediaPresentations management endpoints
 */
export class MultiMediaPresentationController {
    constructor(private dbService: DatabaseService) {}

    /**
     * @swagger
     * /multimediapresentations:
     *   get:
     *     summary: Get all multimedia presentations
     *     tags: [MultimediaPresentations]
     *     security:
     *       - ApiKeyAuth: []
     *     responses:
     *       200:
     *         description: List of multimedia presentations
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/MultimediaPresentationWithPresentationItems'
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
    async getAllMultimediaPresentations(req: Request, res: Response): Promise<void> {
        try {
            const multimediaPresentations = await this.dbService.getMultimediaPresentations();
            res.json(multimediaPresentations);
        } catch (error) {
            console.error('Error fetching multimedia presentations:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}
