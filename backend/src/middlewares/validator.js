// ============================================================
// Middleware Genérico de Validación con Joi
// Sistema de Gestión de Mantenimiento Preventivo
// ============================================================

/**
 * Crea un middleware de validación para el cuerpo de la solicitud (req.body).
 * Valida los datos contra un esquema de Joi proporcionado.
 * Si la validación falla, responde con un error 400 y los detalles.
 * Si la validación es exitosa, reemplaza req.body con los datos limpios.
 *
 * @param {import('joi').ObjectSchema} schema - Esquema de Joi para validar
 * @returns {import('express').RequestHandler} Middleware de Express
 *
 * @example
 * import Joi from 'joi';
 * import { validate } from '../middlewares/validator.js';
 *
 * const crearEquipoSchema = Joi.object({
 *   nombre: Joi.string().required(),
 *   ubicacion: Joi.string().required(),
 * });
 *
 * router.post('/equipos', validate(crearEquipoSchema), controller.crear);
 */
export const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,    // Reportar todos los errores, no solo el primero
      stripUnknown: true,   // Eliminar campos no definidos en el esquema
      errors: {
        wrap: { label: false }, // No envolver las etiquetas entre comillas
      },
    });

    if (error) {
      // Extraer los mensajes de error detallados
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      return res.status(400).json({
        success: false,
        message: 'Error de validación en los datos enviados.',
        errors,
      });
    }

    // Reemplazar el body con los datos validados y limpios
    req.body = value;
    next();
  };
};

/**
 * Crea un middleware de validación para los parámetros de consulta (req.query).
 * Funciona igual que `validate`, pero opera sobre query strings.
 *
 * @param {import('joi').ObjectSchema} schema - Esquema de Joi para validar
 * @returns {import('express').RequestHandler} Middleware de Express
 *
 * @example
 * import Joi from 'joi';
 * import { validateQuery } from '../middlewares/validator.js';
 *
 * const filtroSchema = Joi.object({
 *   estado: Joi.string().valid('activo', 'inactivo'),
 *   pagina: Joi.number().integer().min(1).default(1),
 * });
 *
 * router.get('/equipos', validateQuery(filtroSchema), controller.listar);
 */
export const validateQuery = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true,
      errors: {
        wrap: { label: false },
      },
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      return res.status(400).json({
        success: false,
        message: 'Error de validación en los parámetros de consulta.',
        errors,
      });
    }

    // Reemplazar los query params con los datos validados y limpios
    req.query = value;
    next();
  };
};

/**
 * Crea un middleware de validación para los parámetros de URL (req.params).
 * Funciona igual que `validate`, pero opera sobre los parámetros de la ruta.
 *
 * @param {import('joi').ObjectSchema} schema - Esquema de Joi para validar
 * @returns {import('express').RequestHandler} Middleware de Express
 *
 * @example
 * import Joi from 'joi';
 * import { validateParams } from '../middlewares/validator.js';
 *
 * const idSchema = Joi.object({
 *   id: Joi.number().integer().positive().required(),
 * });
 *
 * router.get('/equipos/:id', validateParams(idSchema), controller.obtenerPorId);
 */
export const validateParams = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.params, {
      abortEarly: false,
      stripUnknown: true,
      errors: {
        wrap: { label: false },
      },
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      return res.status(400).json({
        success: false,
        message: 'Error de validación en los parámetros de la URL.',
        errors,
      });
    }

    // Reemplazar los params con los datos validados y limpios
    req.params = value;
    next();
  };
};
