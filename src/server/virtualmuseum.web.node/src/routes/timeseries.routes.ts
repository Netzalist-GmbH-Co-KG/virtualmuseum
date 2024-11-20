import express, { Router } from 'express';
import { DatabaseService } from '../services/database.service';
import { TimeSeriesController } from '../controllers/timeseries.controller';


export class TimeSeriesRouter {
    private router: Router;
    private controller: TimeSeriesController;

    constructor(dbService: DatabaseService) {
        this.router = express.Router();
        this.controller = new TimeSeriesController(dbService);
        this.setupRoutes();
    }

    private setupRoutes(): void {
        this.router.get('/', this.controller.getTimeSeries.bind(this.controller));
    }

    getRouter(): Router {
        return this.router;
    }
}
