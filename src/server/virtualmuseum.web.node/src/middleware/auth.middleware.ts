import { Request, Response, NextFunction } from 'express';
import { ConfigService } from '../services/config.service';

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
    const apiKey = req.header('x-api-key');
    const config = ConfigService.getInstance();
    const validApiKey = process.env.API_KEY || config.get('API_KEY');

    if (!apiKey || apiKey !== validApiKey) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }

    next();
}
