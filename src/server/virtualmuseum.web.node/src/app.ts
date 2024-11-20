import express, { Application } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { specs } from './config/swagger';
import { validateApiKey } from './middleware/auth.middleware';
import { DatabaseService } from './services/database.service';
import { ConfigService } from './services/config.service';
import { createTenantRouter } from './routes/tenant.routes';

export class App {
    private app: Application;
    private configService: ConfigService;
    private dbService: DatabaseService;

    constructor() {
        this.app = express();
        this.configService = ConfigService.getInstance();
        this.dbService = new DatabaseService(this.configService.get('dbPath'));
        this.initializeMiddlewares();
        this.initializeRoutes();
    }

    private initializeMiddlewares(): void {
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use('/swagger', swaggerUi.serve, swaggerUi.setup(specs));
        this.app.use('/api', validateApiKey);
    }

    private initializeRoutes(): void {
        // Health check endpoint (no auth required)
        this.app.get('/health', (req, res) => {
            res.json({ status: 'healthy' });
        });

        // API routes
        this.app.use('/api/tenants', createTenantRouter(this.dbService));
    }

    public async start(): Promise<void> {
        try {
            await this.dbService.initialize();
            const port = parseInt(this.configService.get('PORT') || '3000', 10);
            const host = this.configService.get('HOST') || '0.0.0.0';

            this.app.listen(port, host, () => {
                console.log(`Server is running on http://localhost:${port}`);
                console.log(`Swagger documentation available at http://localhost:${port}/swagger`);
            });
        } catch (error) {
            console.error('Failed to start the application:', error);
            process.exit(1);
        }
    }

    public getApp(): Application {
        return this.app;
    }
}
