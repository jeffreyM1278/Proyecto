/**
 * Configuración del cliente AWS S3.
 * Se utiliza para el almacenamiento de archivos (imágenes, documentos, etc.)
 * relacionados con los equipos y órdenes de mantenimiento.
 */

import { S3Client } from '@aws-sdk/client-s3';
import config from './index.js';

// Crear instancia del cliente S3
const s3Client = new S3Client({
  region: config.aws.region,
  credentials: {
    accessKeyId: config.aws.accessKeyId,
    secretAccessKey: config.aws.secretAccessKey,
  },
});

// Nombre del bucket configurado
const bucketName = config.aws.bucket;

export { s3Client, bucketName };
