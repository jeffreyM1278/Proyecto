// ============================================================
// Controlador de Historial Técnico
// ============================================================

import * as historyService from '../services/historyService.js';

export const create = async (req, res, next) => {
  try {
    const data = {
      ...req.body,
      technician_id: req.user.id, // Asignar al técnico autenticado si no viene explícito
    };
    const log = await historyService.create(data);
    res.status(201).json({
      success: true,
      message: 'Intervención registrada exitosamente',
      data: log,
    });
  } catch (error) {
    next(error);
  }
};

export const findAll = async (req, res, next) => {
  try {
    const result = await historyService.findAll(req.query);
    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

export const findByEquipment = async (req, res, next) => {
  try {
    const logs = await historyService.findByEquipment(req.params.equipmentId);
    res.status(200).json({
      success: true,
      total: logs.length,
      data: logs,
    });
  } catch (error) {
    next(error);
  }
};

export const getSparePartsSummary = async (req, res, next) => {
  try {
    const summary = await historyService.getSparePartsSummary();
    res.status(200).json({
      success: true,
      data: summary,
    });
  } catch (error) {
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    const result = await historyService.remove(req.params.id);
    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};
