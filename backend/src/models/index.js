// Índice central de modelos - Sistema de Gestión de Mantenimiento Preventivo
// Este archivo inicializa todos los modelos y define las asociaciones entre ellos.

import sequelize from '../config/database.js';

// --- Importación de definiciones de modelos ---
import UserModel from './User.js';
import LocationModel from './Location.js';
import EquipmentModel from './Equipment.js';
import WorkOrderModel from './WorkOrder.js';
import MaintenanceScheduleModel from './MaintenanceSchedule.js';
import InterventionLogModel from './InterventionLog.js';
import SparePartModel from './SparePart.js';
import DocumentModel from './Document.js';

// --- Inicialización de modelos con la instancia de Sequelize ---
const User = UserModel(sequelize);
const Location = LocationModel(sequelize);
const Equipment = EquipmentModel(sequelize);
const WorkOrder = WorkOrderModel(sequelize);
const MaintenanceSchedule = MaintenanceScheduleModel(sequelize);
const InterventionLog = InterventionLogModel(sequelize);
const SparePart = SparePartModel(sequelize);
const Document = DocumentModel(sequelize);

// ============================================================
//  DEFINICIÓN DE ASOCIACIONES (RELACIONES ENTRE MODELOS)
// ============================================================

// --- Ubicación (Location) ---
// Una ubicación tiene muchos equipos y muchos usuarios
Location.hasMany(Equipment, {
  foreignKey: 'location_id',
  as: 'equipment',
});
Location.hasMany(User, {
  foreignKey: 'location_id',
  as: 'users',
});

// --- Usuario (User) ---
// Un usuario pertenece a una ubicación
User.belongsTo(Location, {
  foreignKey: 'location_id',
  as: 'location',
});
// Un usuario tiene muchas órdenes de trabajo asignadas
User.hasMany(WorkOrder, {
  foreignKey: 'assigned_to',
  as: 'assignedOrders',
});

// --- Equipo (Equipment) ---
// Un equipo pertenece a una ubicación
Equipment.belongsTo(Location, {
  foreignKey: 'location_id',
  as: 'location',
});
// Un equipo tiene muchas órdenes de trabajo
Equipment.hasMany(WorkOrder, {
  foreignKey: 'equipment_id',
  as: 'workOrders',
});
// Un equipo tiene muchas intervenciones registradas
Equipment.hasMany(InterventionLog, {
  foreignKey: 'equipment_id',
  as: 'interventions',
});
// Un equipo tiene muchos documentos asociados
Equipment.hasMany(Document, {
  foreignKey: 'equipment_id',
  as: 'documents',
});
// Un equipo tiene muchas programaciones de mantenimiento
Equipment.hasMany(MaintenanceSchedule, {
  foreignKey: 'equipment_id',
  as: 'schedules',
});

// --- Orden de Trabajo (WorkOrder) ---
// Una orden de trabajo pertenece a un equipo
WorkOrder.belongsTo(Equipment, {
  foreignKey: 'equipment_id',
  as: 'equipment',
});
// Una orden de trabajo es asignada a un técnico (usuario)
WorkOrder.belongsTo(User, {
  foreignKey: 'assigned_to',
  as: 'technician',
});
WorkOrder.hasMany(InterventionLog, {
  foreignKey: 'work_order_id',
  as: 'interventionLogs',
});

// --- Programación de Mantenimiento (MaintenanceSchedule) ---
// Una programación pertenece a un equipo
MaintenanceSchedule.belongsTo(Equipment, {
  foreignKey: 'equipment_id',
  as: 'equipment',
});
// Una programación puede tener un técnico asignado
MaintenanceSchedule.belongsTo(User, {
  foreignKey: 'assigned_to',
  as: 'assignedUser',
});
// Una programación puede generar una orden de trabajo
MaintenanceSchedule.belongsTo(WorkOrder, {
  foreignKey: 'work_order_id',
  as: 'workOrder',
});

// --- Bitácora de Intervención (InterventionLog) ---
// Una intervención se realiza sobre un equipo
InterventionLog.belongsTo(Equipment, {
  foreignKey: 'equipment_id',
  as: 'equipment',
});
// Una intervención puede estar asociada a una orden de trabajo
InterventionLog.belongsTo(WorkOrder, {
  foreignKey: 'work_order_id',
  as: 'workOrder',
});
// Una intervención es realizada por un técnico (usuario)
InterventionLog.belongsTo(User, {
  foreignKey: 'technician_id',
  as: 'user',
});
// Una intervención puede utilizar muchos repuestos
InterventionLog.hasMany(SparePart, {
  foreignKey: 'intervention_id',
  as: 'spareParts',
});

// --- Repuesto (SparePart) ---
// Un repuesto pertenece a una intervención
SparePart.belongsTo(InterventionLog, {
  foreignKey: 'intervention_id',
  as: 'intervention',
});

// --- Documento (Document) ---
// Un documento pertenece a un equipo
Document.belongsTo(Equipment, {
  foreignKey: 'equipment_id',
  as: 'equipment',
});
// Un documento fue subido por un usuario
Document.belongsTo(User, {
  foreignKey: 'uploaded_by',
  as: 'uploader',
});

// --- Exportación de todos los modelos y la instancia de Sequelize ---
export {
  sequelize,
  User,
  Location,
  Equipment,
  WorkOrder,
  MaintenanceSchedule,
  InterventionLog,
  SparePart,
  Document,
};
