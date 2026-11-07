// ============================================================
// Servicio de Equipos
// Gestión completa del catálogo de equipos médicos/industriales
// ============================================================

import { Op } from 'sequelize';
import {
  Equipment,
  Location,
  WorkOrder,
  Document,
  InterventionLog,
  SparePart,
} from '../models/index.js';
import { AppError } from '../middlewares/errorHandler.js';

/**
 * Crear un nuevo equipo
 * @param {Object} data - Datos del equipo
 * @returns {Object} Equipo creado con su ubicación
 */
export const create = async (data) => {
  const equipment = await Equipment.create(data);

  // Retornar con la ubicación incluida
  return Equipment.findByPk(equipment.id, {
    include: [{ model: Location, as: 'location' }],
  });
};

/**
 * Listar equipos con búsqueda, filtros y paginación
 * @param {Object} filters - Filtros de búsqueda
 * @param {string} [filters.search] - Búsqueda por número de serie, modelo o marca
 * @param {string} [filters.status] - Filtrar por estado del equipo
 * @param {number} [filters.location_id] - Filtrar por ubicación
 * @param {number} [filters.page=1] - Página actual
 * @param {number} [filters.limit=10] - Resultados por página
 * @returns {Object} Lista paginada de equipos
 */
export const findAll = async (filters = {}) => {
  const { search, status, location_id, page = 1, limit = 10 } = filters;
  const offset = (page - 1) * limit;

  // Construir condiciones de búsqueda dinámicamente
  const where = {};

  if (search) {
    where[Op.or] = [
      { serial_number: { [Op.iLike]: `%${search}%` } },
      { model: { [Op.iLike]: `%${search}%` } },
      { brand: { [Op.iLike]: `%${search}%` } },
    ];
  }

  if (status) {
    where.status = status;
  }

  if (location_id) {
    where.location_id = location_id;
  }

  const { count, rows } = await Equipment.findAndCountAll({
    where,
    include: [{ model: Location, as: 'location' }],
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [['createdAt', 'DESC']],
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
 * Obtener equipo por ID con relaciones completas
 * @param {number} id - ID del equipo
 * @returns {Object} Equipo con ubicación, órdenes recientes y documentos
 */
export const findById = async (id) => {
  const equipment = await Equipment.findByPk(id, {
    include: [
      { model: Location, as: 'location' },
      {
        model: WorkOrder,
        as: 'workOrders',
        limit: 10,
        order: [['createdAt', 'DESC']],
      },
      {
        model: Document,
        as: 'documents',
        order: [['createdAt', 'DESC']],
      },
    ],
  });

  if (!equipment) {
    throw new AppError('Equipo no encontrado', 404);
  }

  return equipment;
};

/**
 * Actualizar datos de un equipo
 * @param {number} id - ID del equipo
 * @param {Object} data - Datos a actualizar
 * @returns {Object} Equipo actualizado
 */
export const update = async (id, data) => {
  const equipment = await Equipment.findByPk(id);

  if (!equipment) {
    throw new AppError('Equipo no encontrado', 404);
  }

  await equipment.update(data);

  // Retornar con ubicación incluida
  return Equipment.findByPk(id, {
    include: [{ model: Location, as: 'location' }],
  });
};

/**
 * Eliminar un equipo
 * @param {number} id - ID del equipo
 * @returns {Object} Mensaje de confirmación
 */
export const remove = async (id) => {
  const equipment = await Equipment.findByPk(id);

  if (!equipment) {
    throw new AppError('Equipo no encontrado', 404);
  }

  await equipment.destroy();

  return { message: 'Equipo eliminado exitosamente' };
};

/**
 * Obtener historial de intervenciones de un equipo
 * @param {number} equipmentId - ID del equipo
 * @returns {Array} Lista de intervenciones con repuestos
 */
export const getEquipmentHistory = async (equipmentId) => {
  // Verificar que el equipo exista
  const equipment = await Equipment.findByPk(equipmentId);
  if (!equipment) {
    throw new AppError('Equipo no encontrado', 404);
  }

  const logs = await InterventionLog.findAll({
    where: { equipment_id: equipmentId },
    include: [
      { model: SparePart, as: 'spareParts' },
    ],
    order: [['createdAt', 'DESC']],
  });

  return logs;
};

/**
 * Obtener documentos asociados a un equipo
 * @param {number} equipmentId - ID del equipo
 * @returns {Array} Lista de documentos del equipo
 */
export const getEquipmentDocuments = async (equipmentId) => {
  // Verificar que el equipo exista
  const equipment = await Equipment.findByPk(equipmentId);
  if (!equipment) {
    throw new AppError('Equipo no encontrado', 404);
  }

  const documents = await Document.findAll({
    where: { equipment_id: equipmentId },
    order: [['createdAt', 'DESC']],
  });

  return documents;
};
