import dotenv from 'dotenv';
import { App } from './app';
import './config/swagger.schemas';

// Load environment variables
dotenv.config();

// Create and start the application
const app = new App();
app.start().catch(error => {
    console.error('Failed to start the application:', error);
    process.exit(1);
});
