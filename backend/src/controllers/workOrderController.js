// ============================================================
// Controlador de Órdenes de Trabajo
// ============================================================

import * as workOrderService from '../services/workOrderService.js';

export const create = async (req, res, next) => {
  try {
    const workOrder = await workOrderService.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Orden de trabajo creada exitosamente',
      data: workOrder,
    });
  } catch (error) {
    next(error);
  }
};

export const findAll = async (req, res, next) => {
  try {
    const result = await workOrderService.findAll(req.query);
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
    const workOrder = await workOrderService.findById(req.params.id);
    res.status(200).json({
      success: true,
      data: workOrder,
    });
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const workOrder = await workOrderService.update(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: 'Orden de trabajo actualizada',
      data: workOrder,
    });
  } catch (error) {
    next(error);
  }
};

export const assignTechnician = async (req, res, next) => {
  try {
    const { technician_id } = req.body;
    const workOrder = await workOrderService.assignTechnician(req.params.id, technician_id);
    res.status(200).json({
      success: true,
      message: 'Técnico asignado exitosamente',
      data: workOrder,
    });
  } catch (error) {
    next(error);
  }
};

export const close = async (req, res, next) => {
  try {
    const workOrder = await workOrderService.close(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: 'Orden de trabajo cerrada exitosamente',
      data: workOrder,
    });
  } catch (error) {
    next(error);
  }
};
