// ============================================================
// Servicio de Usuarios
// Gestión de usuarios del sistema con control de roles
// ============================================================

import { Op } from 'sequelize';
import bcrypt from 'bcryptjs';
import { User } from '../models/index.js';
import { AppError } from '../middlewares/errorHandler.js';

// Campos a excluir en las respuestas por seguridad
const EXCLUDED_FIELDS = ['password', 'reset_token', 'reset_token_expires'];

/**
 * Crear un nuevo usuario con contraseña hasheada
 * @param {Object} data - Datos del usuario
 * @returns {Object} Usuario creado (sin contraseña)
 */
export const create = async (data) => {
  // Verificar que el email no esté en uso
  const existing = await User.findOne({ where: { email: data.email } });
  if (existing) {
    throw new AppError('El correo electrónico ya está registrado', 409);
  }

  // Hashear la contraseña antes de guardar
  const salt = await bcrypt.genSalt(12);
  data.password = await bcrypt.hash(data.password, salt);

  const user = await User.create(data);

  // Retornar sin datos sensibles
  const userData = user.toJSON();
  EXCLUDED_FIELDS.forEach((field) => delete userData[field]);

  return userData;
};

/**
 * Listar usuarios con filtro por rol
 * @param {Object} filters - Filtros de búsqueda
 * @param {string} [filters.role] - Filtrar por rol (ADMIN, TECNICO, USUARIO)
 * @param {string} [filters.search] - Búsqueda por nombre o email
 * @param {number} [filters.page=1] - Página actual
 * @param {number} [filters.limit=10] - Resultados por página
 * @returns {Object} Lista paginada de usuarios
 */
export const findAll = async (filters = {}) => {
  const { role, search, page = 1, limit = 10 } = filters;
  const offset = (page - 1) * limit;

  const where = {};

  if (role) {
    where.role = role;
  }

  if (search) {
    where[Op.or] = [
      { name: { [Op.iLike]: `%${search}%` } },
      { email: { [Op.iLike]: `%${search}%` } },
    ];
  }

  const { count, rows } = await User.findAndCountAll({
    where,
    attributes: { exclude: EXCLUDED_FIELDS },
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [['name', 'ASC']],
  });

  return {
    data: rows,
    pagination: {
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(count / limit),
    },
  };
};

/**
 * Obtener usuario por ID
 * @param {number} id - ID del usuario
 * @returns {Object} Datos del usuario (sin contraseña)
 */
export const findById = async (id) => {
  const user = await User.findByPk(id, {
    attributes: { exclude: EXCLUDED_FIELDS },
  });

  if (!user) {
    throw new AppError('Usuario no encontrado', 404);
  }

  return user;
};

/**
 * Actualizar datos de un usuario
 * Si se proporciona nueva contraseña, se hashea automáticamente
 * @param {number} id - ID del usuario
 * @param {Object} data - Datos a actualizar
 * @returns {Object} Usuario actualizado
 */
export const update = async (id, data) => {
  const user = await User.findByPk(id);

  if (!user) {
    throw new AppError('Usuario no encontrado', 404);
  }

  // Verificar email duplicado si se está cambiando
  if (data.email && data.email !== user.email) {
    const existing = await User.findOne({
      where: {
        email: data.email,
        id: { [Op.ne]: id },
      },
    });

    if (existing) {
      throw new AppError('El correo electrónico ya está en uso por otro usuario', 409);
    }
  }

  // Si se proporciona nueva contraseña, hashearla
  if (data.password) {
    const salt = await bcrypt.genSalt(12);
    data.password = await bcrypt.hash(data.password, salt);
  }

  await user.update(data);

  // Retornar sin datos sensibles
  const userData = user.toJSON();
  EXCLUDED_FIELDS.forEach((field) => delete userData[field]);

  return userData;
};

/**
 * Eliminar usuario (desactivación lógica)
 * No se elimina físicamente, se marca como inactivo
 * @param {number} id - ID del usuario
 * @returns {Object} Mensaje de confirmación
 */
export const remove = async (id) => {
  const user = await User.findByPk(id);

  if (!user) {
    throw new AppError('Usuario no encontrado', 404);
  }

  // Soft delete: desactivar usuario en lugar de eliminarlo
  await user.update({ active: false });

  return { message: 'Usuario desactivado exitosamente' };
};

/**
 * Actualizar perfil propio del usuario
 * Solo permite cambiar campos seguros (nombre, email, contraseña)
 * @param {number} id - ID del usuario
 * @param {Object} data - Datos del perfil a actualizar
 * @returns {Object} Perfil actualizado
 */
export const updateProfile = async (id, data) => {
  const user = await User.findByPk(id);

  if (!user) {
    throw new AppError('Usuario no encontrado', 404);
  }

  // Solo permitir actualizar campos seguros del perfil
  const allowedFields = ['name', 'email', 'password', 'phone'];
  const safeData = {};

  for (const field of allowedFields) {
    if (data[field] !== undefined) {
      safeData[field] = data[field];
    }
  }

  // Hashear nueva contraseña si se proporciona
  if (safeData.password) {
    const salt = await bcrypt.genSalt(12);
    safeData.password = await bcrypt.hash(safeData.password, salt);
  }

  // Verificar email duplicado si se cambia
  if (safeData.email && safeData.email !== user.email) {
    const existing = await User.findOne({
      where: {
        email: safeData.email,
        id: { [Op.ne]: id },
      },
    });

    if (existing) {
      throw new AppError('El correo electrónico ya está en uso', 409);
    }
  }

  await user.update(safeData);

  const userData = user.toJSON();
  EXCLUDED_FIELDS.forEach((field) => delete userData[field]);

  return userData;
};
