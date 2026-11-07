/**
 * Configuración de Swagger/OpenAPI para la documentación de la API.
 * Genera la especificación a partir de comentarios JSDoc en las rutas.
 */

import swaggerJsdoc from 'swagger-jsdoc';
import config from './index.js';

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API - Sistema de Gestión de Mantenimiento Preventivo',
      version: '1.0.0',
      description:
        'Documentación de la API REST para el Sistema de Gestión de Mantenimiento Preventivo ' +
        'de equipos médicos e industriales. Permite gestionar equipos, planes de mantenimiento, ' +
        'órdenes de trabajo, usuarios y reportes.',
      contact: {
        name: 'Soporte del Sistema',
      },
      license: {
        name: 'ISC',
      },
    },
    servers: [
      {
        url: `http://localhost:${config.app.port}/api/v1`,
        description: 'Servidor de desarrollo',
      },
    ],
    // Esquema de seguridad con JWT
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Token JWT obtenido en el endpoint de autenticación',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  // Rutas donde buscar las anotaciones de Swagger
  apis: ['./src/routes/*.js', './src/models/*.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

export default swaggerSpec;
