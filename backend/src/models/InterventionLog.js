// Modelo de Bitácora de Intervención - Sistema de Gestión de Mantenimiento Preventivo
import { DataTypes } from 'sequelize';

/**
 * Define el modelo Bitácora de Intervención para registrar
 * cada intervención técnica realizada sobre un equipo.
 */
const InterventionLogModel = (sequelize) => {
  const InterventionLog = sequelize.define(
    'InterventionLog',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: 'Identificador único de la intervención',
      },
      equipment_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Equipo intervenido (FK a Equipment)',
      },
      work_order_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Orden de trabajo asociada (FK a WorkOrder)',
      },
      technician_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Técnico que realizó la intervención (FK a User)',
      },
      type: {
        type: DataTypes.ENUM('PREVENTIVO', 'CORRECTIVO'),
        allowNull: false,
        comment: 'Tipo de intervención realizada',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Descripción detallada de la intervención',
      },
      failure_reported: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        comment: 'Indica si se reportó una falla durante la intervención',
      },
      failure_details: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Detalles de la falla reportada',
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
          isDate: { msg: 'La fecha de intervención debe ser una fecha válida' },
        },
        comment: 'Fecha en que se realizó la intervención',
      },
    },
    {
      tableName: 'intervention_logs',
      timestamps: true,
      underscored: true,
      comment: 'Tabla de bitácora de intervenciones técnicas',
    }
  );

  return InterventionLog;
};

export default InterventionLogModel;
