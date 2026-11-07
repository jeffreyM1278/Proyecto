// ============================================================
// Controlador de Sedes (Ubicaciones)
// ============================================================

import * as locationService from '../services/locationService.js';

export const create = async (req, res, next) => {
  try {
    const location = await locationService.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Sede creada exitosamente',
      data: location,
    });
  } catch (error) {
    next(error);
  }
};

export const findAll = async (req, res, next) => {
  try {
    const locations = await locationService.findAll();
    res.status(200).json({
      success: true,
      total: locations.length,
      data: locations,
    });
  } catch (error) {
    next(error);
  }
};

export const findById = async (req, res, next) => {
  try {
    const location = await locationService.findById(req.params.id);
    res.status(200).json({
      success: true,
      data: location,
    });
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const location = await locationService.update(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: 'Sede actualizada exitosamente',
      data: location,
    });
  } catch (error) {
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    const result = await locationService.remove(req.params.id);
    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};
