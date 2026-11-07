// Modelo de Repuesto - Sistema de Gestión de Mantenimiento Preventivo
import { DataTypes } from 'sequelize';

/**
 * Define el modelo Repuesto para registrar los repuestos
 * utilizados en cada intervención de mantenimiento.
 */
const SparePartModel = (sequelize) => {
  const SparePart = sequelize.define(
    'SparePart',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: 'Identificador único del repuesto',
      },
      intervention_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Intervención donde se utilizó el repuesto (FK a InterventionLog)',
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: 'El nombre del repuesto no puede estar vacío' },
        },
        comment: 'Nombre del repuesto utilizado',
      },
      quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        validate: {
          min: { args: [1], msg: 'La cantidad debe ser al menos 1' },
        },
        comment: 'Cantidad de repuestos utilizados',
      },
      unit: {
        type: DataTypes.STRING,
        defaultValue: 'unidad',
        comment: 'Unidad de medida del repuesto',
      },
    },
    {
      tableName: 'spare_parts',
      timestamps: true,
      underscored: true,
      comment: 'Tabla de repuestos utilizados en intervenciones',
    }
  );

  return SparePart;
};

export default SparePartModel;
