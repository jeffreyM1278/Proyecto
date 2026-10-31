/**
 * Punto de entrada de la aplicación.
 * Sincroniza la base de datos y arranca el servidor HTTP.
 */

import app from './app.js';
import config from './config/index.js';
import { sequelize } from './models/index.js';

const PORT = config.app.port;

/**
 * Iniciar el servidor.
 * Primero verifica la conexión a la base de datos,
 * luego sincroniza los modelos y finalmente escucha en el puerto configurado.
 */
const startServer = async () => {
  try {
    // Verificar conexión a la base de datos
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos establecida correctamente.');

    // Sincronizar modelos con la base de datos
    // En producción se recomienda usar migraciones en lugar de sync
    await sequelize.sync({ alter: config.app.env === 'development' });
    console.log('✅ Modelos sincronizados con la base de datos.');

    // Iniciar el servidor HTTP
    app.listen(PORT, () => {
      console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
      console.log(`📄 Documentación API: http://localhost:${PORT}/api-docs`);
      console.log(`🌍 Entorno: ${config.app.env}`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error.message);
    process.exit(1);
  }
};

startServer();
