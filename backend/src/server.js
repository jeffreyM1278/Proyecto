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
    // Intentar verificar conexión a la base de datos
    try {
      await sequelize.authenticate();
      console.log('✅ Conexión a la base de datos establecida correctamente.');

      // Sincronizar modelos con la base de datos en desarrollo
      await sequelize.sync({ alter: config.app.env === 'development' });
      console.log('✅ Modelos sincronizados con la base de datos.');
    } catch (dbError) {
      console.warn('⚠️ AVISO: No se pudo conectar a la base de datos local:', dbError.message);
      console.warn('👉 El servidor Express iniciará de todos modos para permitir pruebas de endpoints, salud (/api/v1/health) y Swagger UI (/api-docs).');
      console.warn('👉 Para conectar con la base de datos real, asegúrese de tener encendido MySQL o SQL Server y configurado el archivo .env.');
    }

    // Iniciar el servidor HTTP independientemente
    app.listen(PORT, () => {
      console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
      console.log(`📄 Documentación API interactiva (Swagger): http://localhost:${PORT}/api-docs`);
      console.log(`🩺 Health check: http://localhost:${PORT}/api/v1/health`);
      console.log(`🌍 Entorno: ${config.app.env}`);
    });
  } catch (error) {
    console.error('❌ Error crítico al iniciar el servidor:', error.message);
    process.exit(1);
  }
};

startServer();
