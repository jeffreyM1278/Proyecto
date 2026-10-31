// Validaciones para autenticación y gestión de contraseñas
import Joi from 'joi';

/**
 * Esquema para inicio de sesión
 */
export const loginSchema = Joi.object({
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
    })
});

/**
 * Esquema para solicitar restablecimiento de contraseña
 */
export const forgotPasswordSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'El correo electrónico no es válido',
      'any.required': 'El correo electrónico es obligatorio'
    })
});

/**
 * Esquema para restablecer la contraseña con token
 */
export const resetPasswordSchema = Joi.object({
  token: Joi.string()
    .required()
    .messages({
      'any.required': 'El token de restablecimiento es obligatorio'
    }),
  password: Joi.string()
    .min(6)
    .required()
    .messages({
      'string.min': 'La contraseña debe tener al menos 6 caracteres',
      'any.required': 'La nueva contraseña es obligatoria'
    }),
  confirmPassword: Joi.string()
    .valid(Joi.ref('password'))
    .required()
    .messages({
      'any.only': 'Las contraseñas no coinciden',
      'any.required': 'La confirmación de contraseña es obligatoria'
    })
});
