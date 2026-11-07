// ============================================================
// Rutas de Sedes (Ubicaciones)
// ============================================================

import { Router } from 'express';
import * as locationController from '../controllers/locationController.js';
import { authenticate, authorize } from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validator.js';
import {
  createLocationSchema,
  updateLocationSchema,
} from '../validators/locationValidator.js';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticate);

router.get('/', locationController.findAll);
router.post('/', authorize('ADMIN', 'SUPERVISOR'), validate(createLocationSchema), locationController.create);
router.get('/:id', locationController.findById);
router.put('/:id', authorize('ADMIN', 'SUPERVISOR'), validate(updateLocationSchema), locationController.update);
router.delete('/:id', authorize('ADMIN'), locationController.remove);

export default router;
