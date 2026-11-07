// ============================================================
// Servicio de Mantenimiento Preventivo ⭐ SERVICIO PRINCIPAL
// Cálculo de fechas, programación y generación automática
// de órdenes de trabajo preventivas
// ============================================================

import { Op } from 'sequelize';
import dayjs from 'dayjs';
import {
  Equipment,
  MaintenanceSchedule,
  WorkOrder,
  Location,
  User,
} from '../models/index.js';
import { AppError } from '../middlewares/errorHandler.js';

// Constantes para estados de mantenimiento
const MAINTENANCE_STATUS = {
  OVERDUE: 'VENCIDO',
  UPCOMING: 'PRÓXIMO',
  ON_TRACK: 'AL_DÍA',
};

// Umbral en días para considerar mantenimiento como "próximo"
const UPCOMING_THRESHOLD_DAYS = 7;

/**
 * ⭐ Calcular las próximas fechas de mantenimiento para todos los equipos activos
 * Determina el estado de cada equipo basado en su frecuencia de mantenimiento
 *
 * @param {number|null} locationId - Filtrar por ubicación (opcional)
 * @returns {Array} Lista de equipos con su próxima fecha y estado de mantenimiento
 */
export const calculateNextDates = async (locationId = null) => {
  // Construir filtros de búsqueda (equipos operativos o en mantenimiento, no dados de baja)
  const where = { status: { [Op.ne]: 'FUERA_DE_SERVICIO' } };
  if (locationId) {
    where.location_id = locationId;
  }

  const equipment = await Equipment.findAll({
    where,
    include: [{ model: Location, as: 'location' }],
    order: [['model', 'ASC']],
  });

  const today = dayjs();

  // Calcular fechas y estado para cada equipo
  const results = equipment.map((equip) => {
    const lastMaintenance = equip.last_maintenance
      ? dayjs(equip.last_maintenance)
      : null;
    const frequencyDays = equip.maintenance_frequency_days || equip.frequency_days || 30; // Frecuencia en días

    // Calcular próxima fecha de mantenimiento
    let nextDate = null;
    let daysRemaining = null;
    let status = MAINTENANCE_STATUS.ON_TRACK;

    if (lastMaintenance) {
      nextDate = lastMaintenance.add(frequencyDays, 'day');
      daysRemaining = nextDate.diff(today, 'day');

      // Determinar el estado del mantenimiento
      if (daysRemaining < 0) {
        status = MAINTENANCE_STATUS.OVERDUE;
      } else if (daysRemaining <= UPCOMING_THRESHOLD_DAYS) {
        status = MAINTENANCE_STATUS.UPCOMING;
      } else {
        status = MAINTENANCE_STATUS.ON_TRACK;
      }
    } else {
      // Si nunca se ha realizado mantenimiento, está vencido
      status = MAINTENANCE_STATUS.OVERDUE;
      daysRemaining = -1;
    }

    return {
      equipment_id: equip.id,
      equipment_name: equip.name || `${equip.brand} ${equip.model}`,
      serial_number: equip.serial_number,
      model: equip.model,
      brand: equip.brand,
      location: equip.location,
      last_maintenance: equip.last_maintenance,
      frequency_days: frequencyDays,
      next_date: nextDate ? nextDate.format('YYYY-MM-DD') : null,
      days_remaining: daysRemaining,
      status,
    };
  });

  return results;
};

/**
 * Obtener programación de mantenimiento con filtros
 * @param {Object} filters - Filtros de búsqueda
 * @param {number} [filters.month] - Mes (1-12)
 * @param {number} [filters.year] - Año
 * @param {number} [filters.location_id] - Ubicación
 * @param {string} [filters.status] - Estado del cronograma
 * @returns {Array} Lista de programaciones de mantenimiento
 */
export const getSchedule = async (filters = {}) => {
  const { month, year, location_id, status } = filters;
  const where = {};

  // Filtrar por mes y año usando rango de fechas
  if (month && year) {
    const startDate = dayjs(`${year}-${month}-01`).startOf('month').toDate();
    const endDate = dayjs(`${year}-${month}-01`).endOf('month').toDate();
    where.scheduled_date = { [Op.between]: [startDate, endDate] };
  } else if (year) {
    const startDate = dayjs(`${year}-01-01`).startOf('year').toDate();
    const endDate = dayjs(`${year}-12-31`).endOf('year').toDate();
    where.scheduled_date = { [Op.between]: [startDate, endDate] };
  }

  if (status) {
    where.status = status;
  }

  // Filtro de ubicación a través de la relación con equipo
  const equipmentWhere = {};
  if (location_id) {
    equipmentWhere.location_id = location_id;
  }

  const schedules = await MaintenanceSchedule.findAll({
    where,
    include: [
      {
        model: Equipment,
        as: 'equipment',
        where: Object.keys(equipmentWhere).length > 0 ? equipmentWhere : undefined,
        include: [{ model: Location, as: 'location' }],
      },
      {
        model: User,
        as: 'assignedUser',
        attributes: { exclude: ['password'] },
      },
    ],
    order: [['scheduled_date', 'ASC']],
  });

  return schedules;
};

/**
 * Crear una entrada de programación de mantenimiento
 * @param {Object} data - Datos del cronograma
 * @returns {Object} Programación creada
 */
export const createSchedule = async (data) => {
  // Validar que el equipo exista
  const equipment = await Equipment.findByPk(data.equipment_id);
  if (!equipment) {
    throw new AppError('El equipo especificado no existe', 404);
  }

  const schedule = await MaintenanceSchedule.create(data);

  return MaintenanceSchedule.findByPk(schedule.id, {
    include: [
      {
        model: Equipment,
        as: 'equipment',
        include: [{ model: Location, as: 'location' }],
      },
      {
        model: User,
        as: 'assignedUser',
        attributes: { exclude: ['password'] },
      },
    ],
  });
};

/**
 * Actualizar una programación de mantenimiento
 * @param {number} id - ID de la programación
 * @param {Object} data - Datos a actualizar
 * @returns {Object} Programación actualizada
 */
export const updateSchedule = async (id, data) => {
  const schedule = await MaintenanceSchedule.findByPk(id);

  if (!schedule) {
    throw new AppError('Programación de mantenimiento no encontrada', 404);
  }

  await schedule.update(data);

  return MaintenanceSchedule.findByPk(id, {
    include: [
      {
        model: Equipment,
        as: 'equipment',
        include: [{ model: Location, as: 'location' }],
      },
      {
        model: User,
        as: 'assignedUser',
        attributes: { exclude: ['password'] },
      },
    ],
  });
};

/**
 * Eliminar una programación de mantenimiento
 * @param {number} id - ID de la programación
 * @returns {Object} Mensaje de confirmación
 */
export const deleteSchedule = async (id) => {
  const schedule = await MaintenanceSchedule.findByPk(id);

  if (!schedule) {
    throw new AppError('Programación de mantenimiento no encontrada', 404);
  }

  await schedule.destroy();

  return { message: 'Programación eliminada exitosamente' };
};

/**
 * Obtener todos los equipos con mantenimiento vencido
 * @returns {Array} Equipos con mantenimiento atrasado
 */
export const getOverdue = async () => {
  const allDates = await calculateNextDates();

  // Filtrar solo los equipos con mantenimiento vencido
  return allDates.filter((item) => item.status === MAINTENANCE_STATUS.OVERDUE);
};

/**
 * ⭐ FUNCIÓN PRINCIPAL - Generar órdenes de trabajo preventivas automáticamente
 *
 * Esta función es el corazón del sistema:
 * 1. Calcula las fechas de mantenimiento para todos los equipos
 * 2. Identifica los equipos VENCIDOS o PRÓXIMOS (dentro de 7 días)
 * 3. Verifica que no exista ya una orden abierta para cada equipo
 * 4. Crea automáticamente órdenes de trabajo tipo PREVENTIVO
 *
 * @returns {Object} Resumen de órdenes generadas
 */
export const generatePreventiveOrders = async () => {
  // Paso 1: Calcular estado de mantenimiento de todos los equipos
  const allDates = await calculateNextDates();

  // Paso 2: Filtrar equipos que necesitan mantenimiento
  const needsMaintenance = allDates.filter(
    (item) =>
      item.status === MAINTENANCE_STATUS.OVERDUE ||
      item.status === MAINTENANCE_STATUS.UPCOMING
  );

  const createdOrders = [];
  const skippedEquipment = [];

  // Paso 3: Para cada equipo, verificar si ya tiene orden abierta y crear si no
  for (const item of needsMaintenance) {
    // Verificar si ya existe una orden de trabajo abierta para este equipo
    const existingOrder = await WorkOrder.findOne({
      where: {
        equipment_id: item.equipment_id,
        type: 'PREVENTIVO',
        status: { [Op.in]: ['PENDIENTE', 'EN_PROGRESO'] },
      },
    });

    if (existingOrder) {
      // Ya existe una orden abierta, no crear duplicado
      skippedEquipment.push({
        equipment_id: item.equipment_id,
        equipment_name: item.equipment_name,
        reason: 'Ya existe una orden de trabajo preventiva abierta',
        existing_order_id: existingOrder.id,
      });
      continue;
    }

    // Paso 4: Crear orden de trabajo preventiva
    const workOrder = await WorkOrder.create({
      equipment_id: item.equipment_id,
      type: 'PREVENTIVO',
      status: 'PENDIENTE',
      priority: item.status === MAINTENANCE_STATUS.OVERDUE ? 'ALTA' : 'MEDIA',
      description: `Mantenimiento preventivo programado para ${item.equipment_name} (${item.serial_number}). ` +
        `Último mantenimiento: ${item.last_maintenance || 'Nunca'}. ` +
        `Estado: ${item.status}. Días ${item.days_remaining < 0 ? 'de atraso: ' + Math.abs(item.days_remaining) : 'restantes: ' + item.days_remaining}.`,
      scheduled_date: item.next_date || new Date(),
    });

    createdOrders.push({
      work_order_id: workOrder.id,
      equipment_id: item.equipment_id,
      equipment_name: item.equipment_name,
      status: item.status,
      priority: workOrder.priority,
      scheduled_date: workOrder.scheduled_date,
    });
  }

  return {
    summary: {
      total_evaluated: allDates.length,
      needs_maintenance: needsMaintenance.length,
      orders_created: createdOrders.length,
      skipped: skippedEquipment.length,
    },
    created_orders: createdOrders,
    skipped_equipment: skippedEquipment,
  };
};
