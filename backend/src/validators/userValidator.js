// Validaciones para la gestión de usuarios
import Joi from 'joi';

// Roles válidos del sistema
const USER_ROLES = ['ADMIN', 'TECNICO', 'SUPERVISOR', 'USUARIO'];

/**
 * Esquema para crear un usuario (administración)
 */
export const createUserSchema = Joi.object({
  name: Joi.string()
    .trim()
    .required()
    .messages({
      'any.required': 'El nombre es obligatorio',
      'string.empty': 'El nombre no puede estar vacío'
    }),
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'El correo electrónico no es válido',
      'any.required': 'El correo electrónico es obligatorio'
    }),
  password: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.min': 'La contraseña debe tener al menos 6 caracteres',
      'any.required': 'La contraseña es obligatoria'
    }),
  role: Joi.string()
    .valid(...USER_ROLES)
    .optional()
    .default('USUARIO')
    .messages({
      'any.only': `El rol debe ser uno de: ${USER_ROLES.join(', ')}`
    }),
  location_id: Joi.number()
    .integer()
    .optional()
    .messages({
      'number.base': 'El ID de ubicación debe ser un número'
    })
});

/**
 * Esquema para actualizar un usuario (administración)
 */
export const updateUserSchema = Joi.object({
  name: Joi.string()
    .trim()
    .optional(),
  email: Joi.string()
    .email()
    .optional()
    .messages({
      'string.email': 'El correo electrónico no es válido'
    }),
  password: Joi.string()
    .min(6)
    .optional()
    .messages({
      'string.min': 'La contraseña debe tener al menos 6 caracteres'
    }),
  role: Joi.string()
    .valid(...USER_ROLES)
    .optional()
    .messages({
      'any.only': `El rol debe ser uno de: ${USER_ROLES.join(', ')}`
    }),
  location_id: Joi.number()
    .integer()
    .optional()
    .allow(null)
}).min(1).messages({
  'object.min': 'Debe proporcionar al menos un campo para actualizar'
});

/**
 * Esquema para que el usuario actualice su propio perfil
 */
export const updateProfileSchema = Joi.object({
  name: Joi.string()
    .trim()
    .optional(),
  email: Joi.string()
    .email()
    .optional()
    .messages({
      'string.email': 'El correo electrónico no es válido'
    }),
  password: Joi.string()
    .min(6)
    .optional()
    .messages({
      'string.min': 'La contraseña debe tener al menos 6 caracteres'
    })
}).min(1).messages({
  'object.min': 'Debe proporcionar al menos un campo para actualizar'
});
