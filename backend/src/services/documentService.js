// ============================================================
// Servicio de Documentos
// Gestión de archivos adjuntos a equipos usando AWS S3
// ============================================================

import { Op } from 'sequelize';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Document, Equipment } from '../models/index.js';
import { AppError } from '../middlewares/errorHandler.js';

// Configuración del cliente S3
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME || 'mantenimiento-preventivo-docs';

/**
 * Subir un archivo a S3 y registrar el documento en la base de datos
 * @param {Object} file - Archivo del request (multer)
 * @param {number} equipmentId - ID del equipo asociado
 * @param {number} userId - ID del usuario que sube el documento
 * @returns {Object} Registro del documento creado
 */
export const upload = async (file, equipmentId, userId) => {
  // Validar que el equipo exista
  const equipment = await Equipment.findByPk(equipmentId);
  if (!equipment) {
    throw new AppError('El equipo especificado no existe', 404);
  }

  if (!file) {
    throw new AppError('No se proporcionó ningún archivo', 400);
  }

  // Generar clave única para S3
  const timestamp = Date.now();
  const s3Key = `equipment/${equipmentId}/${timestamp}-${file.originalname}`;

  // Subir archivo a S3
  const uploadParams = {
    Bucket: BUCKET_NAME,
    Key: s3Key,
    Body: file.buffer,
    ContentType: file.mimetype,
    Metadata: {
      'uploaded-by': String(userId),
      'equipment-id': String(equipmentId),
    },
  };

  try {
    await s3Client.send(new PutObjectCommand(uploadParams));
  } catch (error) {
    throw new AppError('Error al subir el archivo a S3: ' + error.message, 500);
  }

  // Registrar documento en la base de datos
  const document = await Document.create({
    equipment_id: equipmentId,
    user_id: userId,
    name: file.originalname,
    type: file.mimetype,
    size: file.size,
    s3_key: s3Key,
  });

  return document;
};

/**
 * Listar documentos con filtros opcionales
 * @param {Object} filters - Filtros de búsqueda
 * @param {number} [filters.equipment_id] - Filtrar por equipo
 * @param {string} [filters.type] - Filtrar por tipo MIME
 * @param {number} [filters.page=1] - Página actual
 * @param {number} [filters.limit=10] - Resultados por página
 * @returns {Object} Lista paginada de documentos
 */
export const findAll = async (filters = {}) => {
  const { equipment_id, type, page = 1, limit = 10 } = filters;
  const offset = (page - 1) * limit;

  const where = {};

  if (equipment_id) where.equipment_id = equipment_id;
  if (type) where.type = { [Op.iLike]: `%${type}%` };

  const { count, rows } = await Document.findAndCountAll({
    where,
    include: [
      { model: Equipment, as: 'equipment' },
    ],
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [['createdAt', 'DESC']],
  });

  return {
    data: rows,
    pagination: {
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(count / limit),
    },
  };
};

/**
 * Generar URL pre-firmada para descargar un documento desde S3
 * La URL tiene validez temporal (15 minutos por defecto)
 * @param {number} id - ID del documento
 * @returns {Object} URL de descarga y datos del documento
 */
export const getDownloadUrl = async (id) => {
  const document = await Document.findByPk(id);

  if (!document) {
    throw new AppError('Documento no encontrado', 404);
  }

  // Generar URL pre-firmada con expiración de 15 minutos
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: document.s3_key,
  });

  const url = await getSignedUrl(s3Client, command, { expiresIn: 900 });

  return {
    document,
    download_url: url,
    expires_in: '15 minutos',
  };
};

/**
 * Eliminar un documento de S3 y de la base de datos
 * @param {number} id - ID del documento
 * @returns {Object} Mensaje de confirmación
 */
export const remove = async (id) => {
  const document = await Document.findByPk(id);

  if (!document) {
    throw new AppError('Documento no encontrado', 404);
  }

  // Eliminar archivo de S3
  try {
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: document.s3_key,
      })
    );
  } catch (error) {
    // Registrar error pero continuar con la eliminación del registro
    console.error('Error al eliminar archivo de S3:', error.message);
  }

  // Eliminar registro de la base de datos
  await document.destroy();

  return { message: 'Documento eliminado exitosamente' };
};
