// ============================================================
// Controlador de Usuarios
// ============================================================

import * as userService from '../services/userService.js';

export const create = async (req, res, next) => {
  try {
    const user = await userService.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Usuario creado exitosamente',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const findAll = async (req, res, next) => {
  try {
    const result = await userService.findAll(req.query);
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
    const user = await userService.findById(req.params.id);
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const user = await userService.update(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: 'Usuario actualizado exitosamente',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    const result = await userService.remove(req.params.id);
    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    // El usuario solo puede actualizar su propio perfil
    const user = await userService.updateProfile(req.user.id, req.body);
    res.status(200).json({
      success: true,
      message: 'Perfil actualizado exitosamente',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
