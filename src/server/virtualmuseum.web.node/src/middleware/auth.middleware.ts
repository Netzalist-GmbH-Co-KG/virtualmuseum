import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';

dotenv.config();

export const validateApiKey = (req: Request, res: Response, next: NextFunction) => {
    const apiKey = req.header('x-api-key');
    
    if (!apiKey || apiKey !== process.env.API_KEY) {
        return res.status(401).json({ error: 'Invalid API Key' });
    }
    
    next();
};
