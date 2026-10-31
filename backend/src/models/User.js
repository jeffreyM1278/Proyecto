// Modelo de Usuario - Sistema de Gestión de Mantenimiento Preventivo
import { DataTypes } from 'sequelize';

/**
 * Define el modelo Usuario con roles diferenciados
 * para administradores, supervisores y técnicos.
 */
const UserModel = (sequelize) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: 'Identificador único del usuario',
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: 'El nombre no puede estar vacío' },
        },
        comment: 'Nombre completo del usuario',
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: 'El correo electrónico ya está registrado',
        },
        validate: {
          isEmail: { msg: 'Debe proporcionar un correo electrónico válido' },
          notEmpty: { msg: 'El correo electrónico no puede estar vacío' },
        },
        comment: 'Correo electrónico único del usuario',
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: { msg: 'La contraseña no puede estar vacía' },
          len: {
            args: [6, 255],
            msg: 'La contraseña debe tener al menos 6 caracteres',
          },
        },
        comment: 'Contraseña hasheada del usuario',
      },
      role: {
        type: DataTypes.ENUM('ADMIN', 'SUPERVISOR', 'TECNICO'),
        defaultValue: 'TECNICO',
        allowNull: false,
        comment: 'Rol del usuario en el sistema',
      },
      location_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        comment: 'Ubicación asignada al usuario (FK a Location)',
      },
      active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        comment: 'Indica si el usuario está activo en el sistema',
      },
    },
    {
      tableName: 'users',
      timestamps: true,
      underscored: true,
      comment: 'Tabla de usuarios del sistema',
    }
  );

  return User;
};

export default UserModel;
