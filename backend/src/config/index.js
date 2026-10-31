/**
 * Archivo central de configuración.
 * Exporta todas las variables de entorno en un objeto estructurado
 * para facilitar el acceso desde cualquier parte de la aplicación.
 */

import dotenv from 'dotenv';

// Cargar variables de entorno desde el archivo .env
dotenv.config();

const config = {
  // Alias directos para conveniencia
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 3000,
  jwtSecret: process.env.JWT_SECRET || 'default_secret_change_me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '24h',

  // Configuración de la aplicación
  app: {
    port: parseInt(process.env.PORT, 10) || 3000,
    env: process.env.NODE_ENV || 'development',
  },

  // Configuración de la base de datos
  db: {
    dialect: process.env.DB_DIALECT || 'mssql', // 'mssql' (SQL Server de Miguel), 'mysql', o 'postgres'
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 1433,
    name: process.env.DB_NAME || 'maintenance_db',
    user: process.env.DB_USER || 'sa',
    password: process.env.DB_PASS || '',
  },

  // Configuración de JWT para autenticación
  jwt: {
    secret: process.env.JWT_SECRET || 'default_secret_change_me',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
  },

  // Configuración de AWS S3
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    region: process.env.AWS_REGION || 'us-east-1',
    bucket: process.env.AWS_S3_BUCKET || '',
  },
};

export default config;
