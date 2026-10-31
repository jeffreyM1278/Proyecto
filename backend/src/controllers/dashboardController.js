// ============================================================
// Controlador de Dashboard
// ============================================================

import * as dashboardService from '../services/dashboardService.js';

/**
 * Obtener estadísticas consolidadas del sistema
 * GET /api/v1/dashboard/stats
 */
export const getStats = async (req, res, next) => {
  try {
    const locationId = req.query.location_id ? parseInt(req.query.location_id, 10) : null;
    const stats = await dashboardService.getStats(locationId);
    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};
