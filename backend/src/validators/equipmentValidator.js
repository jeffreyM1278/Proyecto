// Validaciones para la gestión de equipos
import Joi from 'joi';

// Estados válidos de un equipo
const EQUIPMENT_STATUS = ['ACTIVO', 'INACTIVO', 'EN_MANTENIMIENTO', 'FUERA_DE_SERVICIO'];

/**
 * Esquema para crear un equipo
 */
export const createEquipmentSchema = Joi.object({
  serial_number: Joi.string()
    .trim()
    .required()
    .messages({
      'any.required': 'El número de serie es obligatorio',
      'string.empty': 'El número de serie no puede estar vacío'
    }),
  model: Joi.string()
    .trim()
    .required()
    .messages({
      'any.required': 'El modelo es obligatorio'
    }),
  brand: Joi.string()
    .trim()
    .required()
    .messages({
      'any.required': 'La marca es obligatoria'
    }),
  type: Joi.string()
    .trim()
    .optional(),
  location_id: Joi.number()
    .integer()
    .required()
    .messages({
      'any.required': 'La ubicación es obligatoria',
      'number.base': 'El ID de ubicación debe ser un número'
    }),
  status: Joi.string()
    .valid(...EQUIPMENT_STATUS)
    .optional()
    .messages({
      'any.only': `El estado debe ser uno de: ${EQUIPMENT_STATUS.join(', ')}`
    }),
  install_date: Joi.date()
    .iso()
    .optional()
    .messages({
      'date.format': 'La fecha de instalación debe tener formato válido'
    }),
  maintenance_frequency_days: Joi.number()
    .integer()
    .min(1)
    .optional()
    .messages({
      'number.min': 'La frecuencia de mantenimiento debe ser al menos 1 día'
    }),
  notes: Joi.string()
    .trim()
    .optional()
    .allow('')
});

/**
 * Esquema para actualizar un equipo (todos los campos opcionales)
 */
export const updateEquipmentSchema = Joi.object({
  serial_number: Joi.string().trim().optional(),
  model: Joi.string().trim().optional(),
  brand: Joi.string().trim().optional(),
  type: Joi.string().trim().optional(),
  location_id: Joi.number().integer().optional(),
  status: Joi.string()
    .valid(...EQUIPMENT_STATUS)
    .optional()
    .messages({
      'any.only': `El estado debe ser uno de: ${EQUIPMENT_STATUS.join(', ')}`
    }),
  install_date: Joi.date().iso().optional(),
  maintenance_frequency_days: Joi.number().integer().min(1).optional(),
  notes: Joi.string().trim().optional().allow('')
}).min(1).messages({
  'object.min': 'Debe proporcionar al menos un campo para actualizar'
});

/**
 * Esquema para consultas y filtrado de equipos
 */
export const queryEquipmentSchema = Joi.object({
  search: Joi.string()
    .trim()
    .optional()
    .allow(''),
  status: Joi.string()
    .valid(...EQUIPMENT_STATUS)
    .optional(),
  location_id: Joi.number()
    .integer()
    .optional(),
  page: Joi.number()
    .integer()
    .min(1)
    .default(1)
    .optional(),
  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(20)
    .optional()
});
