import express, { Router, Request, Response, NextFunction } from 'express';
import { DatabaseService } from '../services/database.service';

export class TenantRouter {
    private router: Router;
    private dbService: DatabaseService;

    constructor(dbService: DatabaseService) {
        this.router = express.Router();
        this.dbService = dbService;
        this.setupRoutes();
    }

    private setupRoutes(): void {
        this.router.get('/', this.getTenants.bind(this));
    }

    private async getTenants(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            console.log('Getting tenants...');
            const tenants = await this.dbService.getTenants();
            console.log('Retrieved tenants:', tenants);
            res.json(tenants);
        } catch (error) {
            console.error('Error getting tenants:', error);
            next(error);
        }
    }

    getRouter(): Router {
        return this.router;
    }
}
