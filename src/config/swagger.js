const swaggerJsdoc = require('swagger-jsdoc');
const path = require('path');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Finanzas Espacio Nova',
            version: '1.0.0',
            description: 'Documentación de la API de Finanzas Espacio Nova',
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Servidor de desarrollo',
            },
        ],
    },
    apis: [
        path.join(__dirname, '../controllers/*.js'),
        path.join(__dirname, '../models/*.js'),
        path.join(__dirname, '../routes/*.js')
    ], // Rutas absolutas a los archivos
};

const specs = swaggerJsdoc(options);

module.exports = specs;