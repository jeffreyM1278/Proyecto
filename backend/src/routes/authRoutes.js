// ============================================================
// Rutas de Autenticación
// ============================================================

import { Router } from 'express';
import * as authController from '../controllers/authController.js';
import { validate } from '../middlewares/validator.js';
import { authenticate } from '../middlewares/authMiddleware.js';
import {
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../validators/authValidator.js';

const router = Router();

router.post('/login', validate(loginSchema), authController.login);
router.post('/forgot-password', validate(forgotPasswordSchema), authController.forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), authController.resetPassword);
router.get('/me', authenticate, authController.getMe);

export default router;
