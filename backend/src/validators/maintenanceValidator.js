// Validaciones para la programación de mantenimiento preventivo
import Joi from 'joi';

// Estados válidos de una programación
const SCHEDULE_STATUS = ['PENDIENTE', 'EN_PROGRESO', 'COMPLETADA', 'CANCELADA'];

/**
 * Esquema para crear una programación de mantenimiento
 */
export const createScheduleSchema = Joi.object({
  equipment_id: Joi.number()
    .integer()
    .required()
    .messages({
      'any.required': 'El equipo es obligatorio',
      'number.base': 'El ID del equipo debe ser un número'
    }),
  scheduled_date: Joi.date()
    .iso()
    .required()
    .messages({
      'any.required': 'La fecha programada es obligatoria',
      'date.format': 'La fecha programada debe tener formato válido'
    }),
  assigned_to: Joi.number()
    .integer()
    .optional()
    .messages({
      'number.base': 'El técnico asignado debe ser un ID numérico'
    })
});

/**
 * Esquema para actualizar una programación existente
 */
export const updateScheduleSchema = Joi.object({
  scheduled_date: Joi.date()
    .iso()
    .optional()
    .messages({
      'date.format': 'La fecha programada debe tener formato válido'
    }),
  assigned_to: Joi.number()
    .integer()
    .optional()
    .allow(null)
    .messages({
      'number.base': 'El técnico asignado debe ser un ID numérico'
    }),
  status: Joi.string()
    .valid(...SCHEDULE_STATUS)
    .optional()
    .messages({
      'any.only': `El estado debe ser uno de: ${SCHEDULE_STATUS.join(', ')}`
    })
}).min(1).messages({
  'object.min': 'Debe proporcionar al menos un campo para actualizar'
});
