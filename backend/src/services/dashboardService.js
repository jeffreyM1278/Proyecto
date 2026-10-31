// ============================================================
// Servicio de Dashboard
// Estadísticas y métricas agregadas para el panel de control
// ============================================================

import { Op } from 'sequelize';
import dayjs from 'dayjs';
import sequelize from '../config/database.js';
import { Equipment, WorkOrder, Location } from '../models/index.js';
import { AppError } from '../middlewares/errorHandler.js';
import * as maintenanceService from './maintenanceService.js';

/**
 * Obtener estadísticas generales del sistema
 * Retorna métricas consolidadas para el panel de control principal
 *
 * @param {number|null} locationId - Filtrar por ubicación (opcional)
 * @returns {Object} Estadísticas completas del dashboard
 */
export const getStats = async (locationId = null) => {
  // Construir filtro de ubicación si se proporciona
  const equipmentWhere = {};
  if (locationId) {
    equipmentWhere.location_id = locationId;
  }

  // ── 1. Total de equipos y distribución por estado ──────────
  const totalEquipment = await Equipment.count({ where: equipmentWhere });

  const equipmentByStatus = await Equipment.findAll({
    where: equipmentWhere,
    attributes: [
      'status',
      [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
    ],
    group: ['status'],
    raw: true,
  });

  // ── 2. Estado de mantenimiento preventivo ──────────────────
  let maintenanceDates = [];
  try {
    maintenanceDates = await maintenanceService.calculateNextDates(locationId);
  } catch (error) {
    console.error('Error al calcular fechas de mantenimiento:', error.message);
  }

  // Contar equipos que necesitan atención
  const pendingMaintenance = maintenanceDates.filter(
    (item) => item.status !== 'AL_DÍA'
  ).length;

  const overdueMaintenance = maintenanceDates.filter(
    (item) => item.status === 'VENCIDO'
  ).length;

  const upcomingMaintenance = maintenanceDates.filter(
    (item) => item.status === 'PRÓXIMO'
  ).length;

  // ── 3. Órdenes de trabajo activas ─────────────────────────
  const workOrderWhere = {
    status: { [Op.in]: ['PENDIENTE', 'EN_PROGRESO'] },
  };

  // Si hay filtro por ubicación, filtrar órdenes a través del equipo
  if (locationId) {
    const equipmentIds = await Equipment.findAll({
      where: { location_id: locationId },
      attributes: ['id'],
      raw: true,
    });
    workOrderWhere.equipment_id = {
      [Op.in]: equipmentIds.map((e) => e.id),
    };
  }

  const activeWorkOrders = await WorkOrder.count({ where: workOrderWhere });

  // Distribución de órdenes por estado
  const workOrdersByStatus = await WorkOrder.findAll({
    where: locationId
      ? { equipment_id: { [Op.in]: workOrderWhere.equipment_id?.[Op.in] || [] } }
      : {},
    attributes: [
      'status',
      [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
    ],
    group: ['status'],
    raw: true,
  });

  // ── 4. Alertas recientes ──────────────────────────────────
  const alerts = [];

  // Alertas de mantenimiento vencido
  maintenanceDates
    .filter((item) => item.status === 'VENCIDO')
    .slice(0, 5) // Máximo 5 alertas de vencidos
    .forEach((item) => {
      alerts.push({
        type: 'VENCIDO',
        severity: 'high',
        message: `Mantenimiento vencido para ${item.equipment_name} (${item.serial_number})`,
        equipment_id: item.equipment_id,
        days_overdue: Math.abs(item.days_remaining),
      });
    });

  // Alertas de mantenimiento próximo (dentro de 3 días)
  maintenanceDates
    .filter((item) => item.status === 'PRÓXIMO' && item.days_remaining <= 3)
    .slice(0, 5) // Máximo 5 alertas de próximos
    .forEach((item) => {
      alerts.push({
        type: 'PRÓXIMO',
        severity: 'medium',
        message: `Mantenimiento próximo para ${item.equipment_name} en ${item.days_remaining} día(s)`,
        equipment_id: item.equipment_id,
        days_remaining: item.days_remaining,
      });
    });

  // Ordenar alertas: primero las de alta severidad
  alerts.sort((a, b) => {
    const severityOrder = { high: 0, medium: 1, low: 2 };
    return severityOrder[a.severity] - severityOrder[b.severity];
  });

  // ── 5. Compilar y retornar estadísticas ───────────────────
  return {
    total_equipment: totalEquipment,
    equipment_by_status: equipmentByStatus,
    maintenance: {
      pending: pendingMaintenance,
      overdue: overdueMaintenance,
      upcoming: upcomingMaintenance,
      on_track: maintenanceDates.filter((item) => item.status === 'AL_DÍA').length,
    },
    active_work_orders: activeWorkOrders,
    work_orders_by_status: workOrdersByStatus,
    overdue_maintenance: overdueMaintenance,
    alerts,
  };
};
