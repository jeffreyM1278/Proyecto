// Modelo de Equipo - Sistema de Gestión de Mantenimiento Preventivo
import { DataTypes } from 'sequelize';

/**
 * Define el modelo Equipo que representa los activos
 * físicos sujetos a mantenimiento preventivo y correctivo.
 */
const EquipmentModel = (sequelize) => {
  const Equipment = sequelize.define(
    'Equipment',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: 'Identificador único del equipo',
      },
      serial_number: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: 'El número de serie ya está registrado',
        },
        validate: {
          notEmpty: { msg: 'El número de serie no puede estar vacío' },
        },
        comment: 'Número de serie único del equipo',
      },
      model: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: 'El modelo del equipo no puede estar vacío' },
        },
        comment: 'Modelo del equipo',
      },
      brand: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: 'La marca del equipo no puede estar vacía' },
        },
        comment: 'Marca o fabricante del equipo',
      },
      type: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Tipo o categoría del equipo',
      },
      location_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Ubicación donde se encuentra el equipo (FK a Location)',
      },
      status: {
        type: DataTypes.ENUM('OPERATIVO', 'EN_MANTENIMIENTO', 'FUERA_DE_SERVICIO'),
        defaultValue: 'OPERATIVO',
        allowNull: false,
        comment: 'Estado actual del equipo',
      },
      install_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        comment: 'Fecha de instalación del equipo',
      },
      maintenance_frequency_days: {
        type: DataTypes.INTEGER,
        defaultValue: 90,
        validate: {
          min: { args: [1], msg: 'La frecuencia de mantenimiento debe ser al menos 1 día' },
        },
        comment: 'Frecuencia de mantenimiento preventivo en días',
      },
      last_maintenance: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        comment: 'Fecha del último mantenimiento realizado',
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Notas adicionales sobre el equipo',
      },
    },
    {
      tableName: 'equipment',
      timestamps: true,
      underscored: true,
      comment: 'Tabla de equipos sujetos a mantenimiento',
    }
  );

  return Equipment;
};

export default EquipmentModel;
