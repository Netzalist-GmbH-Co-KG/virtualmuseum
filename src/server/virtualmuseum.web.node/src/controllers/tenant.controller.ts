import { Request, Response } from 'express';
import { DatabaseService } from '../services/database.service';

/**
 * @swagger
 * tags:
 *   name: Tenants
 *   description: Tenant management endpoints
 */
export class TenantController {
    constructor(private dbService: DatabaseService) {}

    /**
     * @swagger
     * /tenants:
     *   get:
     *     summary: Get all tenants with their rooms and inventory items
     *     tags: [Tenants]
     *     security:
     *       - ApiKeyAuth: []
     *     responses:
     *       200:
     *         description: List of tenants with their rooms and inventory items
     *         content:
     *           application/json:
     *             schema:
     *               type: array
     *               items:
     *                 $ref: '#/components/schemas/TenantWithRooms'
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
    async getAllTenants(req: Request, res: Response): Promise<void> {
        try {
            await this.dbService.initialize();
            const tenants = await this.dbService.getTenants();
            res.json(tenants);
        } catch (error) {
            console.error('Error fetching tenants:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}
