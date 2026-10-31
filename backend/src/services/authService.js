// ============================================================
// Servicio de Autenticación
// Maneja login, recuperación de contraseña y gestión de sesión
// ============================================================

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { User } from '../models/index.js';
import { AppError } from '../middlewares/errorHandler.js';

/**
 * Iniciar sesión con email y contraseña
 * @param {string} email - Correo electrónico del usuario
 * @param {string} password - Contraseña en texto plano
 * @returns {Object} Token JWT y datos del usuario
 */
export const login = async (email, password) => {
  // Buscar usuario por email (incluir contraseña para validación)
  const user = await User.findOne({ where: { email } });

  if (!user) {
    throw new AppError('Credenciales inválidas', 401);
  }

  // Verificar que el usuario esté activo
  if (!user.active) {
    throw new AppError('La cuenta ha sido desactivada. Contacte al administrador.', 403);
  }

  // Comparar contraseña proporcionada con el hash almacenado
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new AppError('Credenciales inválidas', 401);
  }

  // Generar token JWT con datos esenciales del usuario
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
  );

  // Retornar token y datos del usuario (sin contraseña)
  const userData = user.toJSON();
  delete userData.password;

  return { token, user: userData };
};

/**
 * Solicitar recuperación de contraseña
 * Genera un token temporal para restablecer la contraseña
 * @param {string} email - Correo del usuario
 * @returns {string} Token de recuperación
 */
export const forgotPassword = async (email) => {
  const user = await User.findOne({ where: { email } });

  if (!user) {
    // Por seguridad no revelamos si el email existe o no
    throw new AppError('Si el correo existe, recibirá instrucciones para restablecer su contraseña.', 200);
  }

  // Generar token aleatorio de recuperación
  const resetToken = crypto.randomBytes(32).toString('hex');

  // Almacenar token hasheado y fecha de expiración en el usuario
  // Nota: En producción se enviaría por correo electrónico
  user.reset_token = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.reset_token_expires = new Date(Date.now() + 30 * 60 * 1000); // 30 minutos
  await user.save();

  return resetToken;
};

/**
 * Restablecer contraseña usando token de recuperación
 * @param {string} token - Token de recuperación
 * @param {string} newPassword - Nueva contraseña
 */
export const resetPassword = async (token, newPassword) => {
  // Hashear el token recibido para comparar con el almacenado
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  // Buscar usuario con token válido y no expirado
  const user = await User.findOne({
    where: {
      reset_token: hashedToken,
      reset_token_expires: { [Symbol.for('gt')]: new Date() },
    },
  });

  if (!user) {
    throw new AppError('Token inválido o expirado', 400);
  }

  // Actualizar contraseña y limpiar tokens de recuperación
  const salt = await bcrypt.genSalt(12);
  user.password = await bcrypt.hash(newPassword, salt);
  user.reset_token = null;
  user.reset_token_expires = null;
  await user.save();

  return { message: 'Contraseña actualizada exitosamente' };
};

/**
 * Obtener usuario por ID (sin contraseña)
 * @param {number} id - ID del usuario
 * @returns {Object} Datos del usuario
 */
export const getUserById = async (id) => {
  const user = await User.findByPk(id, {
    attributes: { exclude: ['password', 'reset_token', 'reset_token_expires'] },
  });

  if (!user) {
    throw new AppError('Usuario no encontrado', 404);
  }

  return user;
};
