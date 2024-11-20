import dotenv from 'dotenv';
import path from 'path';

export class ConfigService {
    private static instance: ConfigService;
    private config: { [key: string]: string } = {};

    private constructor() {
        dotenv.config();
        this.config = {
            dbPath: process.env.SQLITE_DB_PATH || path.join(__dirname, '../../virtualmuseum.db')
        };
    }

    static getInstance(): ConfigService {
        if (!ConfigService.instance) {
            ConfigService.instance = new ConfigService();
        }
        return ConfigService.instance;
    }

    get(key: string): string {
        return this.config[key];
    }
}
