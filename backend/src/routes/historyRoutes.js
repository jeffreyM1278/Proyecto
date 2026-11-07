// ============================================================
// Rutas de Historial Técnico
// ============================================================

import { Router } from 'express';
import * as historyController from '../controllers/historyController.js';
import { authenticate, authorize } from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validator.js';
import { createInterventionSchema } from '../validators/historyValidator.js';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticate);

router.get('/', historyController.findAll);
router.post('/', validate(createInterventionSchema), historyController.create);
router.get('/spare-parts', historyController.getSparePartsSummary);
router.get('/equipment/:equipmentId', historyController.findByEquipment);
router.delete('/:id', authorize('ADMIN'), historyController.remove);

export default router;
