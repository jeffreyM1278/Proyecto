// ============================================================
// Rutas de Documentos (S3)
// ============================================================

import { Router } from 'express';
import multer from 'multer';
import * as documentController from '../controllers/documentController.js';
import { authenticate, authorize } from '../middlewares/authMiddleware.js';

const router = Router();

// Configuración de multer en memoria (para enviar buffer a S3)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 15 * 1024 * 1024, // Máximo 15 MB
  },
});

// Todas las rutas requieren autenticación
router.use(authenticate);

router.get('/', documentController.findAll);
router.post('/upload', upload.single('file'), documentController.upload);
router.get('/:id/download', documentController.getDownloadUrl);
router.delete('/:id', authorize('ADMIN'), documentController.remove);

export default router;
