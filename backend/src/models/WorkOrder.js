// Modelo de Orden de Trabajo - Sistema de Gestión de Mantenimiento Preventivo
import { DataTypes } from 'sequelize';

/**
 * Define el modelo Orden de Trabajo para gestionar
 * las tareas de mantenimiento preventivo y correctivo.
 */
const WorkOrderModel = (sequelize) => {
  const WorkOrder = sequelize.define(
    'WorkOrder',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: 'Identificador único de la orden de trabajo',
      },
      equipment_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Equipo asociado a la orden (FK a Equipment)',
      },
      type: {
        type: DataTypes.ENUM('PREVENTIVO', 'CORRECTIVO'),
        allowNull: false,
        comment: 'Tipo de mantenimiento: preventivo o correctivo',
      },
      priority: {
        type: DataTypes.ENUM('BAJA', 'MEDIA', 'ALTA', 'CRITICA'),
        defaultValue: 'MEDIA',
        allowNull: false,
        comment: 'Nivel de prioridad de la orden',
      },
      status: {
        type: DataTypes.ENUM('PENDIENTE', 'EN_PROGRESO', 'COMPLETADA', 'CANCELADA'),
        defaultValue: 'PENDIENTE',
        allowNull: false,
        comment: 'Estado actual de la orden de trabajo',
      },
      assigned_to: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Técnico asignado a la orden (FK a User)',
      },
      scheduled_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
          isDate: { msg: 'La fecha programada debe ser una fecha válida' },
        },
        comment: 'Fecha programada para ejecutar la orden',
      },
      completed_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        comment: 'Fecha en que se completó la orden',
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Descripción detallada de la orden de trabajo',
      },
      diagnosis: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Diagnóstico técnico realizado',
      },
      checklist: {
        type: DataTypes.JSON,
        allowNull: true,
        comment: 'Lista de verificación en formato JSON',
      },
    },
    {
      tableName: 'work_orders',
      timestamps: true,
      underscored: true,
      comment: 'Tabla de órdenes de trabajo de mantenimiento',
    }
  );

  return WorkOrder;
};

export default WorkOrderModel;
