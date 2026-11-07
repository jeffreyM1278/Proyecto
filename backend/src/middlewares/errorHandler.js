// ============================================================
// Middleware Centralizado de Manejo de Errores
// Sistema de Gestión de Mantenimiento Preventivo
// ============================================================

import config from '../config/config.js';

/**
 * Clase personalizada de error de la aplicación.
 * Extiende la clase nativa Error para incluir un código de estado HTTP
 * y un estado descriptivo ('fail' para errores del cliente, 'error' para errores del servidor).
 */
export class AppError extends Error {
  /**
   * @param {string} message - Mensaje descriptivo del error
   * @param {number} statusCode - Código de estado HTTP (ej. 400, 404, 500)
   */
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    // Capturar la traza del error sin incluir el constructor en ella
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Formatea los errores de validación de Sequelize en un arreglo
 * de mensajes legibles para el usuario.
 *
 * @param {object} err - Error de validación de Sequelize
 * @returns {{ statusCode: number, message: string, errors: string[] }}
 */
const handleSequelizeValidationError = (err) => {
  const errors = err.errors.map((e) => e.message);
  return {
    statusCode: 400,
    message: 'Error de validación en los datos proporcionados.',
    errors,
  };
};

/**
 * Formatea los errores de restricción única de Sequelize.
 *
 * @param {object} err - Error de restricción única de Sequelize
 * @returns {{ statusCode: number, message: string, errors: string[] }}
 */
const handleSequelizeUniqueConstraintError = (err) => {
  const errors = err.errors.map(
    (e) => `El valor '${e.value}' ya existe para el campo '${e.path}'.`
  );
  return {
    statusCode: 409,
    message: 'Error de conflicto: registro duplicado.',
    errors,
  };
};

/**
 * Formatea los errores de JSON Web Token.
 *
 * @returns {{ statusCode: number, message: string }}
 */
const handleJWTError = () => ({
  statusCode: 401,
  message: 'Token no válido. Por favor, inicie sesión nuevamente.',
});

/**
 * Envía la respuesta de error en modo desarrollo (con detalles completos).
 *
 * @param {object} err - Objeto de error
 * @param {import('express').Response} res - Objeto de respuesta de Express
 */
const sendErrorDev = (err, res) => {
  res.status(err.statusCode || 500).json({
    success: false,
    status: err.status || 'error',
    message: err.message,
    errors: err.errors || undefined,
    stack: err.stack,
    error: err,
  });
};

/**
 * Envía la respuesta de error en modo producción (sin detalles sensibles).
 * Solo muestra mensajes descriptivos para errores operacionales conocidos.
 *
 * @param {object} err - Objeto de error
 * @param {import('express').Response} res - Objeto de respuesta de Express
 */
const sendErrorProd = (err, res) => {
  // Errores operacionales: enviar mensaje al cliente
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      status: err.status,
      message: err.message,
      errors: err.errors || undefined,
    });
  }

  // Errores de programación o desconocidos: no revelar detalles
  console.error('ERROR 💥:', err);
  return res.status(500).json({
    success: false,
    status: 'error',
    message: 'Ha ocurrido un error interno en el servidor.',
  });
};

/**
 * Middleware centralizado de manejo de errores.
 * Identifica el tipo de error y responde con el formato adecuado
 * según el entorno (desarrollo o producción).
 *
 * @param {Error} err - Objeto de error capturado
 * @param {import('express').Request} req - Objeto de solicitud de Express
 * @param {import('express').Response} res - Objeto de respuesta de Express
 * @param {import('express').NextFunction} next - Función para pasar al siguiente middleware
 */
export const errorHandler = (err, req, res, next) => {
  // Asignar valores por defecto si no existen
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // En desarrollo: enviar toda la información del error
  if (config.nodeEnv === 'development') {
    return sendErrorDev(err, res);
  }

  // En producción: clasificar y limpiar el error antes de enviarlo
  let error = { ...err, message: err.message, stack: err.stack };

  // Error de validación de Sequelize (campos requeridos, tipos, etc.)
  if (err.name === 'SequelizeValidationError') {
    const formatted = handleSequelizeValidationError(err);
    error.statusCode = formatted.statusCode;
    error.message = formatted.message;
    error.errors = formatted.errors;
    error.isOperational = true;
    error.status = 'fail';
  }

  // Error de restricción única de Sequelize (registros duplicados)
  if (err.name === 'SequelizeUniqueConstraintError') {
    const formatted = handleSequelizeUniqueConstraintError(err);
    error.statusCode = formatted.statusCode;
    error.message = formatted.message;
    error.errors = formatted.errors;
    error.isOperational = true;
    error.status = 'fail';
  }

  // Error de JSON Web Token (token malformado o inválido)
  if (err.name === 'JsonWebTokenError') {
    const formatted = handleJWTError();
    error.statusCode = formatted.statusCode;
    error.message = formatted.message;
    error.isOperational = true;
    error.status = 'fail';
  }

  // Error de token expirado
  if (err.name === 'TokenExpiredError') {
    error.statusCode = 401;
    error.message = 'Su sesión ha expirado. Por favor, inicie sesión nuevamente.';
    error.isOperational = true;
    error.status = 'fail';
  }

  return sendErrorProd(error, res);
};
