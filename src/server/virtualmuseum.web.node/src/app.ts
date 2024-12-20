import express, { Express, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { specs } from './config/swagger';
import { authMiddleware } from './middleware/auth.middleware';
import { DatabaseService } from './services/database.service';
import { ConfigService } from './services/config.service';
import { ApiV1Router } from './routes/apiv1.routes';

export class App {
    private app: Express;
    private configService: ConfigService;
    private dbService: DatabaseService;

    constructor(dbService?: DatabaseService) {
        this.configService = ConfigService.getInstance();
        this.dbService = dbService || new DatabaseService(this.configService.get('dbPath'));
        this.app = express();
        this.initializeMiddlewares();
    }

    async initialize(): Promise<void> {
        await this.dbService.initialize();
        this.initializeRoutes();
        this.setupErrorHandling();
    }

    private initializeMiddlewares(): void {
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use('/swagger', swaggerUi.serve, swaggerUi.setup(specs));
        this.app.use('/api', authMiddleware);
    }

    private initializeRoutes(): void {
        // Health check endpoint (no auth required)
        this.app.get('/health', (req, res) => {
            res.json({ status: 'healthy' });
        });

        // API routes
        const apiV1Router = new ApiV1Router(this.dbService);

        this.app.use('/api/v1/', apiV1Router.getRouter());
    }

    private setupErrorHandling(): void {
        // Handle 404
        this.app.use((req: Request, res: Response) => {
            res.status(404).json({ error: 'Not Found' });
        });

        // Handle all other errors
        this.app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
            console.error('Error:', err);
            res.status(500).json({ 
                error: 'Internal Server Error',
                message: err.message,
                stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
            });
        });
    }

    public async start(): Promise<void> {
        try {
            await this.initialize();
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

    public getApp(): Express {
        return this.app;
    }

    async close(): Promise<void> {
        await this.dbService.close();
    }
}
