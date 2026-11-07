// ============================================================
// Rutas de Órdenes de Trabajo
// ============================================================

import { Router } from 'express';
import * as workOrderController from '../controllers/workOrderController.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validator.js';
import {
  createWorkOrderSchema,
  updateWorkOrderSchema,
  closeWorkOrderSchema,
} from '../validators/workOrderValidator.js';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticate);

router.get('/', workOrderController.findAll);
router.post('/', validate(createWorkOrderSchema), workOrderController.create);
router.get('/:id', workOrderController.findById);
router.put('/:id', validate(updateWorkOrderSchema), workOrderController.update);
router.patch('/:id/assign', workOrderController.assignTechnician);
router.patch('/:id/close', validate(closeWorkOrderSchema), workOrderController.close);

export default router;
