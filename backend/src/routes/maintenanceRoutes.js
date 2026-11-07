// ============================================================
// Rutas de Mantenimiento Preventivo ⭐ CORE DEV 2
// ============================================================

import { Router } from 'express';
import * as maintenanceController from '../controllers/maintenanceController.js';
import { authenticate, authorize } from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validator.js';
import {
  createScheduleSchema,
  updateScheduleSchema,
} from '../validators/maintenanceValidator.js';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticate);

// Cronograma y cálculo
router.get('/schedule', maintenanceController.getSchedule);
router.post('/schedule', validate(createScheduleSchema), maintenanceController.createSchedule);
router.put('/schedule/:id', validate(updateScheduleSchema), maintenanceController.updateSchedule);
router.delete('/schedule/:id', authorize('ADMIN'), maintenanceController.deleteSchedule);

// Endpoints inteligentes de fechas y generación automática
router.get('/calculate', maintenanceController.calculateDates);
router.get('/overdue', maintenanceController.getOverdue);
router.post('/generate-orders', authorize('ADMIN', 'SUPERVISOR'), maintenanceController.generateOrders);

export default router;
