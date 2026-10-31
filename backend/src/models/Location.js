// Modelo de Ubicación - Sistema de Gestión de Mantenimiento Preventivo
import { DataTypes } from 'sequelize';

/**
 * Define el modelo Ubicación para representar
 * las sedes, plantas o localidades donde se encuentran los equipos.
 */
const LocationModel = (sequelize) => {
  const Location = sequelize.define(
    'Location',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: 'Identificador único de la ubicación',
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: 'El nombre de la ubicación no puede estar vacío' },
        },
        comment: 'Nombre de la ubicación o sede',
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Dirección física de la ubicación',
      },
      contact: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Información de contacto de la ubicación',
      },
    },
    {
      tableName: 'locations',
      timestamps: true,
      underscored: true,
      comment: 'Tabla de ubicaciones o sedes',
    }
  );

  return Location;
};

export default LocationModel;
