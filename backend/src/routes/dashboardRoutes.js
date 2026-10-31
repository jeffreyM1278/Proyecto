// ============================================================
// Rutas de Dashboard
// ============================================================

import { Router } from 'express';
import * as dashboardController from '../controllers/dashboardController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = Router();

// Todas las rutas del dashboard requieren autenticación
router.use(authenticate);

router.get('/stats', dashboardController.getStats);

export default router;
