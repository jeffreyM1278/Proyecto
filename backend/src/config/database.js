/**
 * Configuración de la conexión a la base de datos con Sequelize.
 * Soporta SQL Server (diseño de Miguel Arévalo) mediante el dialecto 'mssql',
 * así como MySQL o PostgreSQL vía variable de entorno DB_DIALECT.
 */

import { Sequelize } from 'sequelize';
import config from './index.js';

const dialect = config.db.dialect || 'mssql';

// Opciones específicas según el dialecto
const dialectOptions = {};

if (dialect === 'mssql') {
  dialectOptions.options = {
    encrypt: false, // true para Azure/AWS SSL forzado si aplica
    trustServerCertificate: true, // Para desarrollo local o pruebas
    enableArithAbort: true,
  };
} else if (dialect === 'mysql') {
  dialectOptions.dateStrings = true;
  dialectOptions.typeCast = true;
}

const sequelize = new Sequelize(
  config.db.name,
  config.db.user,
  config.db.password,
  {
    host: config.db.host,
    port: config.db.port,
    dialect,

    // Pool de conexiones
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },

    // Desactivar logging en producción
    logging: config.app.env === 'development' ? console.log : false,

    // Opciones del dialecto
    dialectOptions,
  }
);

export default sequelize;
