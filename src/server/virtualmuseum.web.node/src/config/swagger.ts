import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Virtual Museum API',
            version: '1.0.0',
            description: 'TimeglideVR Virtual Museum Backend API Documentation',
        },
        servers: [
            {
                url: process.env.NODE_ENV === 'production' 
                    ? 'http://0.0.0.0/api' 
                    : 'http://localhost:3000/api',
                description: 'Virtual Museum API Server',
            },
        ],
        components: {
            securitySchemes: {
                ApiKeyAuth: {
                    type: 'apiKey',
                    in: 'header',
                    name: 'x-api-key',
                },
            },
        },
        security: [
            {
                ApiKeyAuth: [],
            },
        ],
    },
    apis: [
        './src/controllers/*.ts',
        './src/routes/*.ts',
        './src/swagger/*.ts'
    ],
};

export const specs = swaggerJsdoc(options);
