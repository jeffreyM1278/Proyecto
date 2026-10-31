// ============================================================
// Middleware de Autenticación y Autorización
// Sistema de Gestión de Mantenimiento Preventivo
// ============================================================

import jwt from 'jsonwebtoken';
import config from '../config/config.js';

/**
 * Middleware que verifica el token JWT del encabezado Authorization.
 * Extrae el token con formato "Bearer <token>", lo valida y adjunta
 * los datos del usuario decodificado a `req.user`.
 *
 * @param {import('express').Request} req - Objeto de solicitud de Express
 * @param {import('express').Response} res - Objeto de respuesta de Express
 * @param {import('express').NextFunction} next - Función para pasar al siguiente middleware
 */
export const authenticate = (req, res, next) => {
  try {
    // Obtener el encabezado de autorización
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Acceso denegado. No se proporcionó un token de autenticación.',
      });
    }

    // Extraer el token (quitar el prefijo "Bearer ")
    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Acceso denegado. Token no válido.',
      });
    }

    // Verificar y decodificar el token
    const decoded = jwt.verify(token, config.jwtSecret);

    // Adjuntar los datos del usuario al objeto de solicitud
    req.user = decoded;

    next();
  } catch (error) {
    // Manejar errores específicos de JWT
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'El token ha expirado. Por favor, inicie sesión nuevamente.',
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token no válido. Por favor, inicie sesión nuevamente.',
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Error de autenticación.',
    });
  }
};

/**
 * Middleware de autorización basado en roles.
 * Verifica que el rol del usuario autenticado se encuentre dentro
 * de la lista de roles permitidos.
 *
 * @param  {...string} roles - Roles permitidos para acceder al recurso
 * @returns {import('express').RequestHandler} Middleware de Express
 *
 * @example
 * // Permitir solo a administradores y técnicos
 * router.get('/ruta', authenticate, authorize('admin', 'tecnico'), controlador);
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    // Verificar que el usuario esté autenticado
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Debe autenticarse antes de acceder a este recurso.',
      });
    }

    // Verificar que el rol del usuario esté en la lista de roles permitidos
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Acceso prohibido. Se requiere uno de los siguientes roles: ${roles.join(', ')}.`,
      });
    }

    next();
  };
};
