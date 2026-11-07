// ============================================================
// Controlador de Mantenimiento Preventivo ⭐ CORE DEV 2
// ============================================================

import * as maintenanceService from '../services/maintenanceService.js';

/**
 * Calcular próximas fechas de mantenimiento
 * GET /api/v1/maintenance/calculate
 */
export const calculateDates = async (req, res, next) => {
  try {
    const locationId = req.query.location_id ? parseInt(req.query.location_id, 10) : null;
    const dates = await maintenanceService.calculateNextDates(locationId);
    res.status(200).json({
      success: true,
      total: dates.length,
      data: dates,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener calendario / cronograma de mantenimientos
 * GET /api/v1/maintenance/schedule
 */
export const getSchedule = async (req, res, next) => {
  try {
    const schedules = await maintenanceService.getSchedule(req.query);
    res.status(200).json({
      success: true,
      total: schedules.length,
      data: schedules,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Programar un mantenimiento
 * POST /api/v1/maintenance/schedule
 */
export const createSchedule = async (req, res, next) => {
  try {
    const schedule = await maintenanceService.createSchedule(req.body);
    res.status(201).json({
      success: true,
      message: 'Mantenimiento programado exitosamente',
      data: schedule,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Actualizar programación
 * PUT /api/v1/maintenance/schedule/:id
 */
export const updateSchedule = async (req, res, next) => {
  try {
    const schedule = await maintenanceService.updateSchedule(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: 'Programación actualizada exitosamente',
      data: schedule,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Cancelar programación (solo Admin)
 * DELETE /api/v1/maintenance/schedule/:id
 */
export const deleteSchedule = async (req, res, next) => {
  try {
    const result = await maintenanceService.deleteSchedule(req.params.id);
    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Listar mantenimientos vencidos
 * GET /api/v1/maintenance/overdue
 */
export const getOverdue = async (req, res, next) => {
  try {
    const overdue = await maintenanceService.getOverdue();
    res.status(200).json({
      success: true,
      total: overdue.length,
      data: overdue,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * ⭐ Generar órdenes de trabajo preventivas de forma automática
 * POST /api/v1/maintenance/generate-orders
 */
export const generateOrders = async (req, res, next) => {
  try {
    const result = await maintenanceService.generatePreventiveOrders();
    res.status(200).json({
      success: true,
      message: 'Proceso de generación de órdenes preventivas completado',
      ...result,
    });
  } catch (error) {
    next(error);
  }
};
