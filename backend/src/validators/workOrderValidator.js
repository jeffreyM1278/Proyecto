// Validaciones para órdenes de trabajo
import Joi from 'joi';

// Tipos de orden de trabajo
const WORK_ORDER_TYPES = ['PREVENTIVO', 'CORRECTIVO'];

// Prioridades válidas
const PRIORITIES = ['BAJA', 'MEDIA', 'ALTA', 'CRITICA'];

// Estados válidos de una orden
const WORK_ORDER_STATUS = ['PENDIENTE', 'EN_PROGRESO', 'COMPLETADA', 'CANCELADA'];

/**
 * Esquema para crear una orden de trabajo
 */
export const createWorkOrderSchema = Joi.object({
  equipment_id: Joi.number()
    .integer()
    .required()
    .messages({
      'any.required': 'El equipo es obligatorio',
      'number.base': 'El ID del equipo debe ser un número'
    }),
  type: Joi.string()
    .valid(...WORK_ORDER_TYPES)
    .required()
    .messages({
      'any.required': 'El tipo de orden es obligatorio',
      'any.only': `El tipo debe ser uno de: ${WORK_ORDER_TYPES.join(', ')}`
    }),
  priority: Joi.string()
    .valid(...PRIORITIES)
    .optional()
    .default('MEDIA')
    .messages({
      'any.only': `La prioridad debe ser una de: ${PRIORITIES.join(', ')}`
    }),
  assigned_to: Joi.number()
    .integer()
    .optional()
    .messages({
      'number.base': 'El técnico asignado debe ser un ID numérico'
    }),
  scheduled_date: Joi.date()
    .iso()
    .required()
    .messages({
      'any.required': 'La fecha programada es obligatoria',
      'date.format': 'La fecha programada debe tener formato válido'
    }),
  description: Joi.string()
    .trim()
    .optional()
    .allow(''),
  checklist: Joi.array()
    .items(Joi.string().trim().min(1))
    .optional()
    .messages({
      'array.base': 'La lista de verificación debe ser un arreglo de textos'
    })
});

/**
 * Esquema para actualizar una orden de trabajo en progreso
 */
export const updateWorkOrderSchema = Joi.object({
  status: Joi.string()
    .valid(...WORK_ORDER_STATUS)
    .optional()
    .messages({
      'any.only': `El estado debe ser uno de: ${WORK_ORDER_STATUS.join(', ')}`
    }),
  diagnosis: Joi.string()
    .trim()
    .optional()
    .allow(''),
  description: Joi.string()
    .trim()
    .optional()
    .allow(''),
  spare_parts_used: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().trim().required().messages({
          'any.required': 'El nombre del repuesto es obligatorio'
        }),
        quantity: Joi.number().min(0).required().messages({
          'any.required': 'La cantidad es obligatoria'
        }),
        unit: Joi.string().trim().required().messages({
          'any.required': 'La unidad de medida es obligatoria'
        })
      })
    )
    .optional()
    .messages({
      'array.base': 'Los repuestos deben ser un arreglo'
    })
}).min(1).messages({
  'object.min': 'Debe proporcionar al menos un campo para actualizar'
});

/**
 * Esquema para cerrar una orden de trabajo
 */
export const closeWorkOrderSchema = Joi.object({
  diagnosis: Joi.string()
    .trim()
    .required()
    .messages({
      'any.required': 'El diagnóstico es obligatorio para cerrar la orden',
      'string.empty': 'El diagnóstico no puede estar vacío'
    }),
  notes: Joi.string()
    .trim()
    .optional()
    .allow('')
});
