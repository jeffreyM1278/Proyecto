// ============================================================
// Controlador de Documentos (S3)
// ============================================================

import * as documentService from '../services/documentService.js';
import { AppError } from '../middlewares/errorHandler.js';

export const upload = async (req, res, next) => {
  try {
    const { equipment_id } = req.body;
    if (!equipment_id) {
      throw new AppError('El campo equipment_id es obligatorio', 400);
    }

    const document = await documentService.upload(
      req.file,
      parseInt(equipment_id, 10),
      req.user.id
    );

    res.status(201).json({
      success: true,
      message: 'Documento subido a S3 exitosamente',
      data: document,
    });
  } catch (error) {
    next(error);
  }
};

export const findAll = async (req, res, next) => {
  try {
    const documents = await documentService.findAll(req.query);
    res.status(200).json({
      success: true,
      total: documents.length,
      data: documents,
    });
  } catch (error) {
    next(error);
  }
};

export const getDownloadUrl = async (req, res, next) => {
  try {
    const result = await documentService.getDownloadUrl(req.params.id);
    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    const result = await documentService.remove(req.params.id);
    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};
