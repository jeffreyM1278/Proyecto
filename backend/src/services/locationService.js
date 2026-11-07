// ============================================================
// Servicio de Ubicaciones
// Gestión de áreas/departamentos donde se ubican los equipos
// ============================================================

import { Op } from 'sequelize';
import sequelize from '../config/database.js';
import { Location, Equipment } from '../models/index.js';
import { AppError } from '../middlewares/errorHandler.js';

/**
 * Crear una nueva ubicación
 * @param {Object} data - Datos de la ubicación
 * @returns {Object} Ubicación creada
 */
export const create = async (data) => {
  // Verificar que no exista una ubicación con el mismo nombre
  const existing = await Location.findOne({
    where: { name: data.name },
  });

  if (existing) {
    throw new AppError('Ya existe una ubicación con ese nombre', 409);
  }

  const location = await Location.create(data);
  return location;
};

/**
 * Listar todas las ubicaciones con conteo de equipos
 * @returns {Array} Lista de ubicaciones con equipment_count
 */
export const findAll = async () => {
  const locations = await Location.findAll({
    attributes: {
      include: [
        [
          sequelize.fn('COUNT', sequelize.col('equipment.id')),
          'equipment_count',
        ],
      ],
    },
    include: [
      {
        model: Equipment,
        as: 'equipment',
        attributes: [], // Solo necesitamos el conteo, no los datos
      },
    ],
    group: ['Location.id'],
    order: [['name', 'ASC']],
  });

  return locations;
};

/**
 * Obtener ubicación por ID con lista de equipos y resumen de estados
 * @param {number} id - ID de la ubicación
 * @returns {Object} Ubicación con equipos y resumen
 */
export const findById = async (id) => {
  const location = await Location.findByPk(id, {
    include: [
      {
        model: Equipment,
        as: 'equipment',
        order: [['name', 'ASC']],
      },
    ],
  });

  if (!location) {
    throw new AppError('Ubicación no encontrada', 404);
  }

  // Calcular resumen de estados de los equipos en esta ubicación
  const equipmentList = location.equipment || [];
  const statusSummary = equipmentList.reduce((acc, equip) => {
    const status = equip.status || 'SIN_ESTADO';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  // Agregar el resumen al resultado
  const result = location.toJSON();
  result.status_summary = statusSummary;
  result.total_equipment = equipmentList.length;

  return result;
};

/**
 * Actualizar una ubicación
 * @param {number} id - ID de la ubicación
 * @param {Object} data - Datos a actualizar
 * @returns {Object} Ubicación actualizada
 */
export const update = async (id, data) => {
  const location = await Location.findByPk(id);

  if (!location) {
    throw new AppError('Ubicación no encontrada', 404);
  }

  // Verificar nombre duplicado si se está cambiando
  if (data.name && data.name !== location.name) {
    const existing = await Location.findOne({
      where: {
        name: data.name,
        id: { [Op.ne]: id },
      },
    });

    if (existing) {
      throw new AppError('Ya existe otra ubicación con ese nombre', 409);
    }
  }

  await location.update(data);
  return location;
};

/**
 * Eliminar una ubicación
 * Verifica que no tenga equipos asignados antes de eliminar
 * @param {number} id - ID de la ubicación
 * @returns {Object} Mensaje de confirmación
 */
export const remove = async (id) => {
  const location = await Location.findByPk(id);

  if (!location) {
    throw new AppError('Ubicación no encontrada', 404);
  }

  // Verificar que no tenga equipos asignados
  const equipmentCount = await Equipment.count({
    where: { location_id: id },
  });

  if (equipmentCount > 0) {
    throw new AppError(
      `No se puede eliminar la ubicación porque tiene ${equipmentCount} equipo(s) asignado(s). Reasigne los equipos primero.`,
      400
    );
  }

  await location.destroy();

  return { message: 'Ubicación eliminada exitosamente' };
};
