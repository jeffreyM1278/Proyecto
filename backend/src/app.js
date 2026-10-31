/**
 * Configuración principal de la aplicación Express.
 * Registra middlewares globales, rutas y el manejador de errores.
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';

import swaggerSpec from './config/swagger.js';
import config from './config/index.js';
import { errorHandler } from './middlewares/errorHandler.js';

// --- Importación de Rutas de la API ---
import authRoutes from './routes/authRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import equipmentRoutes from './routes/equipmentRoutes.js';
import maintenanceRoutes from './routes/maintenanceRoutes.js';
import workOrderRoutes from './routes/workOrderRoutes.js';
import historyRoutes from './routes/historyRoutes.js';
import locationRoutes from './routes/locationRoutes.js';
import documentRoutes from './routes/documentRoutes.js';
import userRoutes from './routes/userRoutes.js';

// --- Crear instancia de Express ---
const app = express();

// --- Middlewares globales ---

// Seguridad: cabeceras HTTP
app.use(helmet());

// Habilitar CORS para peticiones desde el frontend (Julio)
app.use(cors());

// Logger de peticiones HTTP (desactivado en pruebas)
if (config.nodeEnv !== 'test') {
  app.use(morgan('dev'));
}

// Parseo de JSON en el cuerpo de las peticiones
app.use(express.json());

// Parseo de datos URL-encoded (formularios)
app.use(express.urlencoded({ extended: true }));

// --- Documentación interactiva de la API (Swagger UI) ---
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// --- Ruta de verificación de salud (Health Check) ---
app.get('/api/v1/health', (_req, res) => {
  res.json({
    status: 'OK',
    service: 'Maintenance API (Backend - Douglas Moran)',
    timestamp: new Date().toISOString(),
  });
});

// --- Montaje de Rutas de la API v1 ---
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/equipment', equipmentRoutes);
app.use('/api/v1/maintenance', maintenanceRoutes);
app.use('/api/v1/work-orders', workOrderRoutes);
app.use('/api/v1/history', historyRoutes);
app.use('/api/v1/locations', locationRoutes);
app.use('/api/v1/documents', documentRoutes);
app.use('/api/v1/users', userRoutes);

// --- Manejo de rutas no encontradas (404) ---
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Recurso o endpoint no encontrado',
  });
});

// --- Middleware global centralizado de errores ---
app.use(errorHandler);

export default app;
