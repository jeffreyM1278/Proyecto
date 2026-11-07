// Validaciones para la gestión de ubicaciones/sedes
import Joi from 'joi';

/**
 * Esquema para crear una ubicación
 */
export const createLocationSchema = Joi.object({
  name: Joi.string()
    .trim()
    .required()
    .messages({
      'any.required': 'El nombre de la ubicación es obligatorio',
      'string.empty': 'El nombre no puede estar vacío'
    }),
  address: Joi.string()
    .trim()
    .optional()
    .allow(''),
  contact: Joi.string()
    .trim()
    .optional()
    .allow('')
});

/**
 * Esquema para actualizar una ubicación (todos los campos opcionales)
 */
export const updateLocationSchema = Joi.object({
  name: Joi.string()
    .trim()
    .optional(),
  address: Joi.string()
    .trim()
    .optional()
    .allow(''),
  contact: Joi.string()
    .trim()
    .optional()
    .allow('')
}).min(1).messages({
  'object.min': 'Debe proporcionar al menos un campo para actualizar'
});
