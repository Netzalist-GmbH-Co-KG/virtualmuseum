import { Router } from 'express';
import { TenantController } from '../controllers/tenant.controller';
import { DatabaseService } from '../services/database.service';

export function createTenantRouter(dbService: DatabaseService): Router {
    const router = Router();
    const controller = new TenantController(dbService);

    router.get('/', (req, res) => controller.getAllTenants(req, res));

    return router;
}
