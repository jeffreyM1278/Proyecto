// Modelo de Programación de Mantenimiento - Sistema de Gestión de Mantenimiento Preventivo
import { DataTypes } from 'sequelize';

/**
 * Define el modelo Programación de Mantenimiento para planificar
 * las fechas de mantenimiento preventivo de cada equipo.
 */
const MaintenanceScheduleModel = (sequelize) => {
  const MaintenanceSchedule = sequelize.define(
    'MaintenanceSchedule',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: 'Identificador único de la programación',
      },
      equipment_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Equipo al que se le programa el mantenimiento (FK a Equipment)',
      },
      scheduled_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
          isDate: { msg: 'La fecha programada debe ser una fecha válida' },
        },
        comment: 'Fecha programada para el mantenimiento',
      },
      assigned_to: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Técnico asignado para el mantenimiento (FK a User)',
      },
      status: {
        type: DataTypes.ENUM('PROGRAMADO', 'COMPLETADO', 'CANCELADO'),
        defaultValue: 'PROGRAMADO',
        allowNull: false,
        comment: 'Estado de la programación',
      },
      work_order_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Orden de trabajo generada a partir de esta programación (FK a WorkOrder)',
      },
    },
    {
      tableName: 'maintenance_schedules',
      timestamps: true,
      underscored: true,
      comment: 'Tabla de programación de mantenimientos preventivos',
    }
  );

  return MaintenanceSchedule;
};

export default MaintenanceScheduleModel;
