// Modelo de Documento - Sistema de Gestión de Mantenimiento Preventivo
import { DataTypes } from 'sequelize';

/**
 * Define el modelo Documento para gestionar archivos
 * asociados a los equipos (manuales, fichas técnicas, etc.).
 */
const DocumentModel = (sequelize) => {
  const Document = sequelize.define(
    'Document',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: 'Identificador único del documento',
      },
      equipment_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Equipo al que pertenece el documento (FK a Equipment)',
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: 'El nombre del documento no puede estar vacío' },
        },
        comment: 'Nombre descriptivo del documento',
      },
      type: {
        type: DataTypes.ENUM('MANUAL', 'FICHA_TECNICA', 'OTRO'),
        defaultValue: 'OTRO',
        allowNull: false,
        comment: 'Tipo de documento',
      },
      s3_key: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: 'La clave S3 no puede estar vacía' },
        },
        comment: 'Clave del archivo en Amazon S3',
      },
      uploaded_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Usuario que subió el documento (FK a User)',
      },
      file_size: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Tamaño del archivo en bytes',
      },
    },
    {
      tableName: 'documents',
      timestamps: true,
      underscored: true,
      comment: 'Tabla de documentos asociados a equipos',
    }
  );

  return Document;
};

export default DocumentModel;
