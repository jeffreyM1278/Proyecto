// ============================================================
// Rutas de Usuarios
// ============================================================

import { Router } from 'express';
import * as userController from '../controllers/userController.js';
import { authenticate, authorize } from '../middlewares/authMiddleware.js';
import { validate } from '../middlewares/validator.js';
import {
  createUserSchema,
  updateUserSchema,
  updateProfileSchema,
} from '../validators/userValidator.js';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authenticate);

// Perfil propio (cualquier usuario autenticado)
router.put('/profile', validate(updateProfileSchema), userController.updateProfile);

// Gestión de usuarios (Admin y Supervisor)
router.get('/', authorize('ADMIN', 'SUPERVISOR'), userController.findAll);
router.post('/', authorize('ADMIN'), validate(createUserSchema), userController.create);
router.get('/:id', authorize('ADMIN', 'SUPERVISOR'), userController.findById);
router.put('/:id', authorize('ADMIN'), validate(updateUserSchema), userController.update);
router.delete('/:id', authorize('ADMIN'), userController.remove);

export default router;
