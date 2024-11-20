import express, { Router } from 'express';
import { DatabaseService } from '../services/database.service';
import { MultiMediaPresentationController } from '../controllers/multimediapresentation.controller';


export class MultiMediaPresentationRouter {
    private router: Router;
    private controller: MultiMediaPresentationController;

    constructor(dbService: DatabaseService) {
        this.router = express.Router();
        this.controller = new MultiMediaPresentationController(dbService);
        this.setupRoutes();
    }

    private setupRoutes(): void {
        this.router.get('/', this.controller.getAllMultimediaPresentations.bind(this.controller));
    }

    getRouter(): Router {
        return this.router;
    }
}
