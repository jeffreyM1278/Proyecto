// ============================================================
// Servicio de Órdenes de Trabajo
// Gestión del ciclo de vida completo de órdenes de trabajo
// ============================================================

import { Op } from 'sequelize';
import {
  WorkOrder,
  Equipment,
  User,
  InterventionLog,
} from '../models/index.js';
import { AppError } from '../middlewares/errorHandler.js';

/**
 * Crear una nueva orden de trabajo
 * @param {Object} data - Datos de la orden
 * @returns {Object} Orden de trabajo creada
 */
export const create = async (data) => {
  // Validar que el equipo exista
  const equipment = await Equipment.findByPk(data.equipment_id);
  if (!equipment) {
    throw new AppError('El equipo especificado no existe', 404);
  }

  // Validar que el técnico exista si se proporciona
  if (data.assigned_to) {
    const technician = await User.findByPk(data.assigned_to);
    if (!technician) {
      throw new AppError('El técnico asignado no existe', 404);
    }
  }

  const workOrder = await WorkOrder.create(data);

  // Retornar con relaciones incluidas
  return WorkOrder.findByPk(workOrder.id, {
    include: [
      { model: Equipment, as: 'equipment' },
      {
        model: User,
        as: 'technician',
        attributes: { exclude: ['password'] },
      },
    ],
  });
};

/**
 * Listar órdenes de trabajo con filtros y paginación
 * @param {Object} filters - Filtros de búsqueda
 * @param {number} [filters.assigned_to] - Filtrar por técnico asignado
 * @param {string} [filters.status] - Filtrar por estado
 * @param {string} [filters.type] - Filtrar por tipo (PREVENTIVO/CORRECTIVO)
 * @param {number} [filters.equipment_id] - Filtrar por equipo
 * @param {number} [filters.page=1] - Página actual
 * @param {number} [filters.limit=10] - Resultados por página
 * @returns {Object} Lista paginada de órdenes
 */
export const findAll = async (filters = {}) => {
  const {
    assigned_to,
    status,
    type,
    equipment_id,
    page = 1,
    limit = 10,
  } = filters;
  const offset = (page - 1) * limit;

  // Construir condiciones dinámicamente
  const where = {};

  if (assigned_to) where.assigned_to = assigned_to;
  if (status) where.status = status;
  if (type) where.type = type;
  if (equipment_id) where.equipment_id = equipment_id;

  const { count, rows } = await WorkOrder.findAndCountAll({
    where,
    include: [
      { model: Equipment, as: 'equipment' },
      {
        model: User,
        as: 'technician',
        attributes: { exclude: ['password'] },
      },
    ],
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
 * Obtener orden de trabajo por ID con detalles completos
 * @param {number} id - ID de la orden
 * @returns {Object} Orden con equipo, técnico y registros de intervención
 */
export const findById = async (id) => {
  const workOrder = await WorkOrder.findByPk(id, {
    include: [
      { model: Equipment, as: 'equipment' },
      {
        model: User,
        as: 'technician',
        attributes: { exclude: ['password'] },
      },
      {
        model: InterventionLog,
        as: 'interventionLogs',
        order: [['createdAt', 'DESC']],
      },
    ],
  });

  if (!workOrder) {
    throw new AppError('Orden de trabajo no encontrada', 404);
  }

  return workOrder;
};

/**
 * Actualizar una orden de trabajo
 * @param {number} id - ID de la orden
 * @param {Object} data - Datos a actualizar
 * @returns {Object} Orden actualizada
 */
export const update = async (id, data) => {
  const workOrder = await WorkOrder.findByPk(id);

  if (!workOrder) {
    throw new AppError('Orden de trabajo no encontrada', 404);
  }

  // No permitir modificar órdenes ya completadas
  if (workOrder.status === 'COMPLETADA') {
    throw new AppError('No se puede modificar una orden ya completada', 400);
  }

  await workOrder.update(data);

  return WorkOrder.findByPk(id, {
    include: [
      { model: Equipment, as: 'equipment' },
      {
        model: User,
        as: 'technician',
        attributes: { exclude: ['password'] },
      },
    ],
  });
};

/**
 * Asignar un técnico a una orden de trabajo
 * @param {number} id - ID de la orden
 * @param {number} technicianId - ID del técnico a asignar
 * @returns {Object} Orden actualizada con técnico asignado
 */
export const assignTechnician = async (id, technicianId) => {
  const workOrder = await WorkOrder.findByPk(id);
  if (!workOrder) {
    throw new AppError('Orden de trabajo no encontrada', 404);
  }

  // Verificar que el técnico exista y tenga el rol adecuado
  const technician = await User.findByPk(technicianId);
  if (!technician) {
    throw new AppError('Técnico no encontrado', 404);
  }

  if (technician.role !== 'TECNICO' && technician.role !== 'ADMIN') {
    throw new AppError('El usuario seleccionado no tiene rol de técnico', 400);
  }

  await workOrder.update({
    assigned_to: technicianId,
    status: workOrder.status === 'PENDIENTE' ? 'EN_PROGRESO' : workOrder.status,
  });

  return WorkOrder.findByPk(id, {
    include: [
      { model: Equipment, as: 'equipment' },
      {
        model: User,
        as: 'technician',
        attributes: { exclude: ['password'] },
      },
    ],
  });
};

/**
 * Cerrar una orden de trabajo
 * Establece estado COMPLETADA, fecha de completado y crea registro de intervención
 * @param {number} id - ID de la orden
 * @param {Object} data - Datos de cierre (diagnóstico, observaciones, etc.)
 * @returns {Object} Orden cerrada con registro de intervención creado
 */
export const close = async (id, data) => {
  const workOrder = await WorkOrder.findByPk(id, {
    include: [{ model: Equipment, as: 'equipment' }],
  });

  if (!workOrder) {
    throw new AppError('Orden de trabajo no encontrada', 404);
  }

  if (workOrder.status === 'COMPLETADA') {
    throw new AppError('La orden ya se encuentra completada', 400);
  }

  // Actualizar la orden con estado completada
  await workOrder.update({
    status: 'COMPLETADA',
    completed_date: new Date(),
    diagnosis: data.diagnosis || workOrder.diagnosis,
    observations: data.observations || workOrder.observations,
  });

  // Crear registro de intervención automáticamente
  const interventionLog = await InterventionLog.create({
    equipment_id: workOrder.equipment_id,
    work_order_id: workOrder.id,
    user_id: workOrder.assigned_to,
    type: workOrder.type,
    description: data.diagnosis || 'Orden completada',
    date: new Date(),
    observations: data.observations || null,
  });

  // Actualizar fecha de último mantenimiento del equipo si es preventivo
  if (workOrder.type === 'PREVENTIVO') {
    await Equipment.update(
      { last_maintenance: new Date() },
      { where: { id: workOrder.equipment_id } }
    );
  }

  return {
    workOrder: await WorkOrder.findByPk(id, {
      include: [
        { model: Equipment, as: 'equipment' },
        {
          model: User,
          as: 'technician',
          attributes: { exclude: ['password'] },
        },
      ],
    }),
    interventionLog,
  };
};
