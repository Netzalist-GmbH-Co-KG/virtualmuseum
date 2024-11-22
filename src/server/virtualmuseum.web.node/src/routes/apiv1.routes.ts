import express, { Router } from 'express';
import { DatabaseService } from '../services/database.service';
import { MultiMediaPresentationController } from '../controllers/multimediapresentation.controller';
import { TenantController } from '../controllers/tenant.controller';
import { TimeSeriesController } from '../controllers/timeseries.controller';
import { TopographicalTableController } from '../controllers/topographicaltable.controller';


export class ApiV1Router {
    private router: Router;
    private mmpController: MultiMediaPresentationController;
    private tenantController: TenantController;
    private timeSeriesController: TimeSeriesController;
    private topographicalTableController: TopographicalTableController;

    constructor(dbService: DatabaseService) {
        this.router = express.Router();
        this.mmpController = new MultiMediaPresentationController(dbService);
        this.tenantController = new TenantController(dbService);
        this.timeSeriesController = new TimeSeriesController(dbService);
        this.topographicalTableController = new TopographicalTableController(dbService);
        this.setupRoutes();
    }

    private setupRoutes(): void {
        this.router.get('/multimediapresentations/', this.mmpController.getAllMultimediaPresentations.bind(this.mmpController));
        this.router.get('/tenants/', this.tenantController.getAllTenants.bind(this.tenantController));
        this.router.get('/timeseries/', this.timeSeriesController.getTimeSeries.bind(this.timeSeriesController));
        this.router.get('/topographicaltables/:tableId', this.topographicalTableController.getTopographicalTable.bind(this.topographicalTableController));
    }

    getRouter(): Router {
        return this.router;
    }
}
