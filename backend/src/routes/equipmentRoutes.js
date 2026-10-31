// ============================================================
// Rutas de Equipos (Maquinaria)
// ============================================================

import { Router } from 'express';
import * as equipmentController from '../controllers/equipmentController.js';
import { authenticate, authorize } from '../middlewares/authMiddleware.js';
import { validate, validateQuery } from '../middlewares/validator.js';
import {
  createEquipmentSchema,
  updateEquipmentSchema,
  queryEquipmentSchema,
} from '../validators/equipmentValidator.js';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticate);

router.get('/', validateQuery(queryEquipmentSchema), equipmentController.findAll);
router.post('/', validate(createEquipmentSchema), equipmentController.create);
router.get('/:id', equipmentController.findById);
router.put('/:id', validate(updateEquipmentSchema), equipmentController.update);
router.delete('/:id', authorize('ADMIN'), equipmentController.remove);

// Rutas anidadas
router.get('/:id/history', equipmentController.getHistory);
router.get('/:id/documents', equipmentController.getDocuments);

export default router;
