// ============================================================
// Controlador de Equipos (Maquinaria)
// ============================================================

import * as equipmentService from '../services/equipmentService.js';

export const create = async (req, res, next) => {
  try {
    const equipment = await equipmentService.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Equipo registrado exitosamente',
      data: equipment,
    });
  } catch (error) {
    next(error);
  }
};

export const findAll = async (req, res, next) => {
  try {
    const result = await equipmentService.findAll(req.query);
    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

export const findById = async (req, res, next) => {
  try {
    const equipment = await equipmentService.findById(req.params.id);
    res.status(200).json({
      success: true,
      data: equipment,
    });
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const equipment = await equipmentService.update(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: 'Equipo actualizado exitosamente',
      data: equipment,
    });
  } catch (error) {
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    const result = await equipmentService.remove(req.params.id);
    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

export const getHistory = async (req, res, next) => {
  try {
    const history = await equipmentService.getEquipmentHistory(req.params.id);
    res.status(200).json({
      success: true,
      data: history,
    });
  } catch (error) {
    next(error);
  }
};

export const getDocuments = async (req, res, next) => {
  try {
    const documents = await equipmentService.getEquipmentDocuments(req.params.id);
    res.status(200).json({
      success: true,
      data: documents,
    });
  } catch (error) {
    next(error);
  }
};
