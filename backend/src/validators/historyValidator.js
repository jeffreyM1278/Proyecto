// Validaciones para el historial de intervenciones
import Joi from 'joi';

// Tipos de intervención
const INTERVENTION_TYPES = ['PREVENTIVO', 'CORRECTIVO', 'EMERGENCIA', 'INSPECCION'];

/**
 * Esquema para registrar una intervención en el historial
 */
export const createInterventionSchema = Joi.object({
  equipment_id: Joi.number()
    .integer()
    .required()
    .messages({
      'any.required': 'El equipo es obligatorio',
      'number.base': 'El ID del equipo debe ser un número'
    }),
  work_order_id: Joi.number()
    .integer()
    .optional()
    .allow(null)
    .messages({
      'number.base': 'El ID de la orden de trabajo debe ser un número'
    }),
  type: Joi.string()
    .valid(...INTERVENTION_TYPES)
    .required()
    .messages({
      'any.required': 'El tipo de intervención es obligatorio',
      'any.only': `El tipo debe ser uno de: ${INTERVENTION_TYPES.join(', ')}`
    }),
  description: Joi.string()
    .trim()
    .required()
    .messages({
      'any.required': 'La descripción es obligatoria',
      'string.empty': 'La descripción no puede estar vacía'
    }),
  failure_reported: Joi.boolean()
    .optional()
    .default(false),
  failure_details: Joi.string()
    .trim()
    .optional()
    .allow('')
    .when('failure_reported', {
      is: true,
      then: Joi.string().trim().required().messages({
        'any.required': 'Los detalles de la falla son obligatorios cuando se reporta una falla'
      })
    }),
  date: Joi.date()
    .iso()
    .required()
    .messages({
      'any.required': 'La fecha de la intervención es obligatoria',
      'date.format': 'La fecha debe tener formato válido'
    }),
  spare_parts: Joi.array()
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
});
