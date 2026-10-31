# 🔧 API de Mantenimiento Preventivo (Backend)

**Universidad Católica de El Salvador**  
**Cómputo en la Nube - Grupo B | Ing. Herberth Contreras**  
**Rol:** Desarrollador 2 (Backend Maintenance API) — Douglas Moran  
**Repositorio:** [Proyecto](https://github.com/jeffreyM1278/Proyecto.git)

---

## 🏗️ Arquitectura del Sistema

El backend está desarrollado en **Node.js** con **Express.js**, utilizando una arquitectura limpia en capas (Layered Architecture):

```
backend/
├── .env.example              # Plantilla de variables de entorno
├── .gitignore                # Reglas de exclusión para Git
├── package.json              # Dependencias y scripts
├── README.md                 # Esta documentación
└── src/
    ├── server.js             # Punto de entrada (inicializa DB y servidor HTTP)
    ├── app.js                # Configuración de Express, middlewares y rutas
    ├── config/               # Configuraciones (BD, AWS S3, Swagger, variables)
    │   ├── database.js
    │   ├── aws.js
    │   ├── swagger.js
    │   └── index.js
    ├── middlewares/          # Autenticación JWT, RBAC, Validador, Manejador de Errores
    │   ├── authMiddleware.js
    │   ├── errorHandler.js
    │   └── validator.js
    ├── models/               # Modelos Sequelize y asociaciones relacionales
    │   ├── User.js
    │   ├── Equipment.js
    │   ├── Location.js
    │   ├── WorkOrder.js
    │   ├── MaintenanceSchedule.js
    │   ├── InterventionLog.js
    │   ├── SparePart.js
    │   ├── Document.js
    │   └── index.js
    ├── services/             # Lógica de negocio (Cálculo de fechas, órdenes, S3)
    │   ├── maintenanceService.js   ⭐ CORE: Lógica de cálculo y órdenes automáticas
    │   ├── workOrderService.js
    │   ├── equipmentService.js
    │   ├── dashboardService.js
    │   ├── historyService.js
    │   ├── documentService.js
    │   ├── userService.js
    │   ├── authService.js
    │   └── locationService.js
    ├── controllers/          # Controladores HTTP (manejo de request/response)
    │   ├── authController.js
    │   ├── dashboardController.js
    │   ├── equipmentController.js
    │   ├── maintenanceController.js
    │   ├── workOrderController.js
    │   ├── historyController.js
    │   ├── locationController.js
    │   ├── documentController.js
    │   └── userController.js
    ├── routes/               # Definición de rutas y mapeo de endpoints
    │   ├── authRoutes.js
    │   ├── dashboardRoutes.js
    │   ├── equipmentRoutes.js
    │   ├── maintenanceRoutes.js
    │   ├── workOrderRoutes.js
    │   ├── historyRoutes.js
    │   ├── locationRoutes.js
    │   ├── documentRoutes.js
    │   └── userRoutes.js
    └── validators/           # Esquemas de validación de entradas con Joi
        ├── authValidator.js
        ├── equipmentValidator.js
        ├── maintenanceValidator.js
        ├── workOrderValidator.js
        ├── historyValidator.js
        ├── locationValidator.js
        └── userValidator.js
```

---

## ⭐ Lógica Core Desarrollada (Rol Desarrollador 2)

### 1. Cálculo Automático de Fechas de Mantenimiento (`services/maintenanceService.js`)
Evalúa los equipos operativos, su frecuencia programada (días) y última fecha de intervención:
- **`VENCIDO`**: Si la fecha calculada es anterior al día actual.
- **`PRÓXIMO`**: Si la fecha calculada está dentro de los próximos 7 días.
- **`AL_DÍA`**: Si faltan más de 7 días para el mantenimiento.

### 2. Generador Automático de Órdenes de Trabajo Preventivas
- Identifica equipos en estado `VENCIDO` o `PRÓXIMO`.
- Verifica que no exista una orden preventiva abierta previa para evitar duplicados.
- Crea automáticamente órdenes con tipo `PREVENTIVO`, prioridad calculada y fecha objetivo.

### 3. Integración con AWS Free Tier
- **Amazon S3**: Almacenamiento y generación de URLs prefirmadas para fichas técnicas y manuales en PDF.
- **AWS IAM**: Control de acceso granular (RBAC con roles `ADMIN`, `SUPERVISOR`, `TECNICO`), restringiendo operaciones críticas como eliminación únicamente a administradores.

---

## 🚀 Instalación y Puesta en Marcha

### Prerrequisitos
- Node.js v18+ y npm
- Servidor MySQL o PostgreSQL (coordinado con Miguel Arévalo)

### 1. Configurar variables de entorno
```bash
cp .env.example .env
```
Editar `.env` con las credenciales de la base de datos y AWS S3:
```env
PORT=3000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=3306
DB_NAME=maintenance_db
DB_USER=root
DB_PASS=tu_password
JWT_SECRET=super_secret_key_12345
AWS_REGION=us-east-1
AWS_S3_BUCKET=mantenimiento-manuales-bucket
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Iniciar en modo desarrollo
```bash
npm run dev
```

El servidor iniciará en `http://localhost:3000`.  
La documentación Swagger interactiva estará disponible en:  
👉 **`http://localhost:3000/api-docs`**

---

## 📡 Mapeo de Rutas de la API

| Prefijo de Ruta | Módulo | Responsabilidad |
|---|---|---|
| `/api/v1/auth` | Autenticación | Login JWT, recuperación y restablecimiento |
| `/api/v1/dashboard` | Dashboard | Métricas agregadas, conteos y alertas |
| `/api/v1/equipment` | Inventario | CRUD de maquinaria, historial y manuales |
| `/api/v1/maintenance` | Mantenimiento | Cronograma, cálculo de fechas y generación automática de órdenes |
| `/api/v1/work-orders` | Órdenes de Trabajo | Creación, asignación a técnicos, diagnóstico y cierre |
| `/api/v1/history` | Historial Técnico | Intervenciones pasadas, fallas y control de repuestos |
| `/api/v1/locations` | Sedes | Sedes hospitalarias/industriales y equipos asignados |
| `/api/v1/documents` | Documentos S3 | Subida a AWS S3 y descarga con URLs prefirmadas |
| `/api/v1/users` | Usuarios | Gestión de cuentas y roles (ADMIN, SUPERVISOR, TECNICO) |
| `/api/v1/health` | Health Check | Verificación de estado del servidor |
