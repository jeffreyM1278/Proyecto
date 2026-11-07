// ============================================================
// Servicio de Historial de Intervenciones
// Registro de todas las intervenciones realizadas a los equipos
// ============================================================

import { Op } from 'sequelize';
import sequelize from '../config/database.js';
import {
  InterventionLog,
  Equipment,
  User,
  SparePart,
} from '../models/index.js';
import { AppError } from '../middlewares/errorHandler.js';

/**
 * Crear un registro de intervención
 * Si se proporcionan repuestos, los crea en lote asociados a la intervención
 * @param {Object} data - Datos de la intervención
 * @param {Array} [data.spare_parts] - Lista de repuestos utilizados
 * @returns {Object} Registro creado con repuestos incluidos
 */
export const create = async (data) => {
  // Usar transacción para garantizar integridad de datos
  const transaction = await sequelize.transaction();

  try {
    // Separar repuestos del resto de datos
    const { spare_parts, ...logData } = data;

    // Crear el registro de intervención
    const interventionLog = await InterventionLog.create(logData, { transaction });

    // Si se proporcionaron repuestos, crearlos en lote
    if (spare_parts && spare_parts.length > 0) {
      const sparePartsData = spare_parts.map((part) => ({
        ...part,
        intervention_log_id: interventionLog.id,
      }));

      await SparePart.bulkCreate(sparePartsData, { transaction });
    }

    await transaction.commit();

    // Retornar con relaciones completas
    return InterventionLog.findByPk(interventionLog.id, {
      include: [
        { model: Equipment, as: 'equipment' },
        {
          model: User,
          as: 'user',
          attributes: { exclude: ['password'] },
        },
        { model: SparePart, as: 'spareParts' },
      ],
    });
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

/**
 * Listar registros de intervención con filtros
 * @param {Object} filters - Filtros de búsqueda
 * @param {number} [filters.equipment_id] - Filtrar por equipo
 * @param {number} [filters.user_id] - Filtrar por usuario/técnico
 * @param {string} [filters.type] - Filtrar por tipo de intervención
 * @param {number} [filters.page=1] - Página actual
 * @param {number} [filters.limit=10] - Resultados por página
 * @returns {Object} Lista paginada de intervenciones
 */
export const findAll = async (filters = {}) => {
  const { equipment_id, user_id, type, page = 1, limit = 10 } = filters;
  const offset = (page - 1) * limit;

  const where = {};

  if (equipment_id) where.equipment_id = equipment_id;
  if (user_id) where.user_id = user_id;
  if (type) where.type = type;

  const { count, rows } = await InterventionLog.findAndCountAll({
    where,
    include: [
      { model: Equipment, as: 'equipment' },
      {
        model: User,
        as: 'user',
        attributes: { exclude: ['password'] },
      },
      { model: SparePart, as: 'spareParts' },
    ],
    limit: parseInt(limit),
    offset: parseInt(offset),
    order: [['date', 'DESC']],
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
 * Obtener todas las intervenciones de un equipo específico
 * @param {number} equipmentId - ID del equipo
 * @returns {Array} Lista de intervenciones con repuestos
 */
export const findByEquipment = async (equipmentId) => {
  // Verificar que el equipo exista
  const equipment = await Equipment.findByPk(equipmentId);
  if (!equipment) {
    throw new AppError('Equipo no encontrado', 404);
  }

  const logs = await InterventionLog.findAll({
    where: { equipment_id: equipmentId },
    include: [
      {
        model: User,
        as: 'user',
        attributes: { exclude: ['password'] },
      },
      { model: SparePart, as: 'spareParts' },
    ],
    order: [['date', 'DESC']],
  });

  return logs;
};

/**
 * Obtener resumen agregado de uso de repuestos
 * Útil para análisis de costos y planificación de inventario
 * @returns {Array} Resumen de repuestos con cantidades y costos totales
 */
export const getSparePartsSummary = async () => {
  const summary = await SparePart.findAll({
    attributes: [
      'name',
      [sequelize.fn('SUM', sequelize.col('quantity')), 'total_quantity'],
      [sequelize.fn('SUM', sequelize.literal('quantity * unit_cost')), 'total_cost'],
      [sequelize.fn('COUNT', sequelize.col('SparePart.id')), 'usage_count'],
    ],
    group: ['name'],
    order: [[sequelize.fn('SUM', sequelize.col('quantity')), 'DESC']],
    raw: true,
  });

  return summary;
};

/**
 * Eliminar un registro de intervención y sus repuestos asociados
 * @param {number} id - ID del registro de intervención
 * @returns {Object} Mensaje de confirmación
 */
export const remove = async (id) => {
  const log = await InterventionLog.findByPk(id);

  if (!log) {
    throw new AppError('Registro de intervención no encontrado', 404);
  }

  // Los repuestos se eliminan en cascada gracias a la relación del modelo
  await log.destroy();

  return { message: 'Registro de intervención eliminado exitosamente' };
};
