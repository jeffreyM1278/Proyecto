# 📄 INFORME TÉCNICO DE AVANCE DE LABORATORIO
## SISTEMA DE GESTIÓN DE MANTENIMIENTO PREVENTIVO DE EQUIPOS MÉDICOS E INDUSTRIALES (**MedControl**)

---

**UNIVERSIDAD CATÓLICA DE EL SALVADOR (UNICAES)**  
**FACULTAD DE INGENIERÍA Y ARQUITECTURA**  
**ASIGNATURA:** Cómputo en la Nube — Grupo B  
**DOCENTE:** Ing. Herberth Contreras  
**FECHA DE ENTREGA:** Sábado 7 de Noviembre de 2026  
**INTEGRANTE EVALUADO:** Douglas Moran  
**ROL EN EL PROYECTO:** **Desarrollador 2 — Backend Maintenance API**  
*(Lógica para generación de órdenes de trabajo y cálculo de fechas de mantenimiento preventivo)*  

**Repositorio GitHub:** [https://github.com/jeffreyM1278/Proyecto.git](https://github.com/jeffreyM1278/Proyecto.git)  
**Rama Oficial de Trabajo:** `feature/backend-maintenance-api`  

---

## 🎯 RESUMEN EJECUTIVO Y OBJETIVOS DEL AVANCE

El presente documento constituye la memoria técnica y evidencia formal del cumplimiento de los requerimientos correspondientes al **Primer Avance Evaluado de Laboratorio (25% por rubro, 100% total)** para el rol de **Desarrollador 2 (Backend Maintenance API)**.

Como responsable del núcleo lógico del sistema, se ha diseñado, estructurado, codificado y versionado una **API REST profesional en Node.js + Express** bajo arquitectura por capas (*Layered Architecture*), totalmente desacoplada, escalable y alineada tanto con el esquema de base de datos relacional de 20 tablas propuesto por el Modelador de Base de Datos (Miguel Arévalo), como con la interfaz de usuario en React + Vite + Tailwind CSS desarrollada por el Líder Frontend (Julio Herrera).

Adicionalmente, se integran los servicios de almacenamiento seguro en **Amazon S3** y políticas de autorización granular basadas en roles (**AWS IAM / RBAC**), garantizando cero exposición de credenciales mediante variables de entorno versionadas de forma segura.

---

## 📊 MATRIZ DE CUMPLIMIENTO DE CRITERIOS DE EVALUACIÓN

| Criterio de Evaluación | Ponderación | Estado | Evidencia Principal |
|---|:---:|:---:|---|
| **1. Repositorio, Git y Estructura de Código** | **25%** | **CUMPLIDO AL 100%** | Estructura modular `/backend`, `.gitignore` riguroso, rama `feature/backend-maintenance-api`, **10 commits consecutivos** bajo convención *Conventional Commits*. |
| **2. Avance de Backend, API y Base de Datos** | **25%** | **CUMPLIDO AL 100%** | 9 módulos de endpoints REST, script de conexión Sequelize con pool de conexiones y dialecto dual (**SQL Server / MySQL**), **2 operaciones CRUD completas y probadas** (Equipos y Órdenes) con colección de Postman y Swagger OpenAPI 3.0. |
| **3. Lógica Core de Mantenimiento (Valor de Dev 2)** | *(Diferenciador)* | **CUMPLIDO AL 100%** | Algoritmo matemático de cálculo de fechas preventivas (`FrecuenciaValor` + `FrecuenciaUnidad`) y generador automático de órdenes preventivas sin duplicados. |
| **4. Infraestructura AWS Cloud y Seguridad Inicial** | **25%** | **CUMPLIDO AL 100%** | Integración nativa con **Amazon S3** (URLs prefirmadas para PDFs), autenticación JWT + RBAC (restricción estricta de `DELETE` solo a `ADMIN`), y gestión segura con `.env.example`. |
| **5. Diseño y Alineación con Frontend** | **25%** | **CUMPLIDO AL 100%** | Contratos de API coincidentes al 100% con los campos, filtros y modales del prototipo navegable **MedControl** (React + Tailwind). |

---

## 🛠️ CRITERIO 1: REPOSITORIO, GIT Y ESTRUCTURA DE CÓDIGO (25%)

### 1.1. Organización del Directorio `/backend`
Se implementó una arquitectura en capas limpias (*Clean Architecture / N-Tier Architecture*), garantizando el principio de responsabilidad única (*Single Responsibility Principle*):

```
backend/
├── .env.example                       # Plantilla de variables de entorno (sin secretos)
├── .gitignore                         # Exclusión estricta de dependencias y archivos sensibles
├── package.json                       # Manifiesto de dependencias (ES Modules)
├── README.md                          # Guía técnica completa de instalación y uso
├── MedControl-API.postman_collection.json # Colección de pruebas Postman lista para importar
└── src/
    ├── server.js                      # Entry point: verificación de BD y arranque de Express
    ├── app.js                         # Configuración central de Express, CORS, Helmet y Swagger
    ├── config/                        # Configuraciones de infraestructura
    │   ├── database.js                # Conexión Sequelize con pool (SQL Server / MySQL)
    │   ├── aws.js                     # Cliente AWS S3 v3 (@aws-sdk/client-s3)
    │   ├── swagger.js                 # Especificación interactiva OpenAPI 3.0
    │   └── index.js                   # Carga centralizada y tipada de variables de entorno
    ├── middlewares/                   # Capa de seguridad y control de flujo
    │   ├── authMiddleware.js          # Extracción/validación de JWT y autorización RBAC
    │   ├── errorHandler.js            # Manejador global centralizado de excepciones operacionales
    │   └── validator.js               # Middleware genérico de validación con Joi
    ├── models/                        # Modelos Sequelize mapeando las tablas del sistema
    │   ├── index.js                   # Inicialización y definición de asociaciones relacionales
    │   ├── User.js                    # Modelo de usuarios y credenciales
    │   ├── Location.js                # Modelo de sedes y hospitales
    │   ├── Equipment.js               # Modelo de maquinaria y equipos médicos
    │   ├── MaintenanceSchedule.js     # Modelo de cronogramas y planes
    │   ├── WorkOrder.js               # Modelo de órdenes de trabajo
    │   ├── InterventionLog.js         # Modelo de bitácora técnica de fallas
    │   ├── SparePart.js               # Modelo de repuestos e insumos
    │   └── Document.js                # Modelo de metadatos de documentos en S3
    ├── services/                      # Lógica de negocio (Capa pura sin acoplamiento HTTP)
    │   ├── maintenanceService.js      # ⭐ MOTOR CORE: Cálculo de fechas y órdenes automáticas
    │   ├── workOrderService.js        # Gestión del ciclo de vida de órdenes y diagnósticos
    │   ├── equipmentService.js        # Lógica de parque instalado y fichas técnicas
    │   ├── dashboardService.js        # Agregación analítica de métricas y alertas
    │   ├── historyService.js          # Bitácora histórica y consumo de repuestos
    │   ├── documentService.js         # Carga y generación de URLs prefirmadas en S3
    │   ├── locationService.js         # Agrupación por sedes y áreas
    │   ├── userService.js             # Administración de usuarios y contraseñas hasheadas
    │   └── authService.js             # Autenticación, generación de JWT y recuperación
    ├── controllers/                   # Controladores HTTP (adaptadores Request/Response)
    │   ├── maintenanceController.js
    │   ├── workOrderController.js
    │   ├── equipmentController.js
    │   ├── dashboardController.js
    │   ├── historyController.js
    │   ├── documentController.js
    │   ├── locationController.js
    │   ├── userController.js
    │   └── authController.js
    ├── routes/                        # Definición de rutas y mapeo de verbos HTTP
    │   ├── maintenanceRoutes.js
    │   ├── workOrderRoutes.js
    │   ├── equipmentRoutes.js
    │   ├── dashboardRoutes.js
    │   ├── historyRoutes.js
    │   ├── documentRoutes.js
    │   ├── locationRoutes.js
    │   ├── userRoutes.js
    │   └── authRoutes.js
    └── validators/                    # Esquemas de validación de entrada con Joi
        ├── maintenanceValidator.js
        ├── workOrderValidator.js
        ├── equipmentValidator.js
        ├── historyValidator.js
        ├── locationValidator.js
        ├── userValidator.js
        └── authValidator.js
```

### 1.2. Uso Riguroso de `.gitignore`
Para garantizar la seguridad del código fuente y evitar la exposición accidental de secretos en GitHub, el archivo `.gitignore` excluye:
- Dependencias de terceros (`node_modules/`)
- Secretos y variables locales (`.env`, `.env.local`, `.env.production`)
- Registros de depuración y ejecución (`npm-debug.log*`, `yarn-error.log*`, `logs/`)
- Archivos de cobertura de pruebas y empaquetado (`coverage/`, `dist/`, `build/`)
- Archivos de configuración del entorno de desarrollo (`.vscode/`, `.idea/`, `.DS_Store`)
- Archivos temporales de carga multimedia (`uploads/`)

### 1.3. Estrategia de Ramas e Historial de 10 Commits
El trabajo del Desarrollador 2 se desarrolló y subió de forma modular y progresiva en la rama oficial:
**`feature/backend-maintenance-api`** (derivada de `main`), registrando **10 commits atómicos** bajo la especificación internacional *Conventional Commits*:

```bash
# Registro real de commits en el repositorio:
670bf69 feat(app): configure Express application entry point and add complete README documentation
3f2fed3 feat(controllers-routes): implement REST endpoints and route handlers for all modules
0b7fd38 feat(services): implement AWS S3 document management and dashboard analytics
8c80271 feat(services): add domain services for equipment, technical history, users, and locations
c7c594a feat(services): implement core maintenance calculation and preventive work order generator
52a638b feat(validators): create Joi request validation schemas for all modules
61a9153 feat(middlewares): add JWT authentication, RBAC authorization, and centralized error handler
611d57a feat(models): implement Sequelize models matching relational database schema
8d78b97 feat(config): setup core configurations for database, AWS S3, Swagger, and env
06877e1 chore(backend): initialize Node.js project and environment configuration
```

---

## 🗄️ CRITERIO 2: AVANCE DE BACKEND, API Y BASE DE DATOS (25%)

### 2.1. Conexión a Base de Datos con Sequelize (`src/config/database.js`)
El script de conexión implementa una arquitectura flexible que soporta el esquema de **SQL Server** diseñado por Miguel Arévalo (mediante el dialecto `mssql` y el conector `tedious`), así como **MySQL** y **PostgreSQL**. Cuenta con *Connection Pooling* y control de zona horaria específico para El Salvador (CST, `-06:00`):

```javascript
import { Sequelize } from 'sequelize';
import config from './index.js';

const dialect = config.db.dialect || 'mssql';

const dialectOptions = {};
if (dialect === 'mssql') {
  dialectOptions.options = {
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true,
  };
} else if (dialect === 'mysql') {
  dialectOptions.dateStrings = true;
  dialectOptions.typeCast = true;
}

const sequelize = new Sequelize(
  config.db.name,
  config.db.user,
  config.db.password,
  {
    host: config.db.host,
    port: config.db.port,
    dialect,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    logging: config.app.env === 'development' ? console.log : false,
    dialectOptions,
  }
);

export default sequelize;
```

### 2.2. Definición Integral de Endpoints REST
El backend expone 9 grupos de endpoints organizados bajo el estándar RESTful con versionamiento `/api/v1`:

| Método | Ruta | Descripción | Rol Mínimo |
|---|---|---|:---:|
| `POST` | `/api/v1/auth/login` | Iniciar sesión y obtener token JWT | Público |
| `GET` | `/api/v1/auth/me` | Obtener perfil del usuario autenticado | Técnico |
| `GET` | `/api/v1/dashboard/stats` | Métricas agregadas y alertas para el dashboard | Técnico |
| **`GET`** | **`/api/v1/equipment`** | **Listar inventario con buscador, filtros y paginación** | **Técnico** |
| **`POST`** | **`/api/v1/equipment`** | **Registrar nuevo equipo médico o industrial** | **Técnico** |
| **`GET`** | **`/api/v1/equipment/:id`** | **Consultar ficha técnica completa de equipo** | **Técnico** |
| **`PUT`** | **`/api/v1/equipment/:id`** | **Actualizar estado operativo o datos del equipo** | **Técnico** |
| **`DELETE`** | **`/api/v1/equipment/:id`** | **Dar de baja equipo del parque instalado** | **ADMIN** |
| **`GET`** | **`/api/v1/work-orders`** | **Listar órdenes de trabajo asignadas con filtros** | **Técnico** |
| **`POST`** | **`/api/v1/work-orders`** | **Crear orden de trabajo (Preventiva o Correctiva)** | **Técnico** |
| **`GET`** | **`/api/v1/work-orders/:id`** | **Consultar detalle de orden, diagnóstico y checklist** | **Técnico** |
| **`PUT`** | **`/api/v1/work-orders/:id`** | **Actualizar diagnóstico, progreso y repuestos** | **Técnico** |
| **`PATCH`** | **`/api/v1/work-orders/:id/close`** | **Cerrar orden y generar asiento en bitácora técnica** | **Técnico** |
| `GET` | `/api/v1/maintenance/calculate` | ⭐ Calcular próximas fechas según planes y frecuencias | Sistema |
| `GET` | `/api/v1/maintenance/overdue` | Listar mantenimientos con fecha vencida | Supervisor |
| `POST` | `/api/v1/maintenance/generate-orders` | ⭐ Generar automáticamente órdenes preventivas | Supervisor |
| `GET` | `/api/v1/maintenance/schedule` | Cronograma de mantenimientos para vista calendario | Técnico |
| `GET` | `/api/v1/history` | Consultar bitácora histórica de intervenciones | Técnico |
| `POST` | `/api/v1/history` | Registrar intervención con consumo de repuestos | Técnico |
| `DELETE` | `/api/v1/history/:id` | Eliminar registro duplicado | **ADMIN** |
| `GET` | `/api/v1/locations` | Listar sedes hospitalarias y plantas industriales | Técnico |
| `POST` | `/api/v1/documents/upload` | Subir manual técnico o ficha en PDF a Amazon S3 | Técnico |
| `GET` | `/api/v1/documents/:id/download`| Obtener URL prefirmada temporal para descarga de S3 | Técnico |

---

## 🧪 EVIDENCIA DE PRUEBAS CRUD REALES (POSTMAN / SWAGGER)

A continuación se detallan las pruebas de las dos operaciones CRUD completas exigidas por la rúbrica de evaluación:

### 3.1. CRUD 1: Inventario de Maquinaria y Equipos Médicos (`/api/v1/equipment`)

#### A. Crear Equipo (POST `/api/v1/equipment`)
* **Request Payload (JSON):**
```json
{
  "serial_number": "MX450-2026-SV01",
  "model": "IntelliVue MX450",
  "brand": "Philips Healthcare",
  "type": "Monitor multiparámetro",
  "location_id": 1,
  "status": "OPERATIVO",
  "install_date": "2026-01-15",
  "maintenance_frequency_days": 90,
  "notes": "Equipo instalado en Unidad de Cuidados Intensivos UCI-A"
}
```
* **Response Payload (HTTP 201 Created):**
```json
{
  "success": true,
  "message": "Equipo registrado exitosamente",
  "data": {
    "id": 1,
    "serial_number": "MX450-2026-SV01",
    "model": "IntelliVue MX450",
    "brand": "Philips Healthcare",
    "type": "Monitor multiparámetro",
    "location_id": 1,
    "status": "OPERATIVO",
    "install_date": "2026-01-15",
    "maintenance_frequency_days": 90,
    "notes": "Equipo instalado en Unidad de Cuidados Intensivos UCI-A",
    "created_at": "2026-11-06T20:25:00.000Z",
    "location": {
      "id": 1,
      "name": "Hospital Central San Salvador"
    }
  }
}
```

#### B. Listar Parque Instalado con Paginación (GET `/api/v1/equipment?page=1&limit=10`)
* **Response Payload (HTTP 200 OK):**
```json
{
  "success": true,
  "total": 1,
  "page": 1,
  "totalPages": 1,
  "data": [
    {
      "id": 1,
      "serial_number": "MX450-2026-SV01",
      "model": "IntelliVue MX450",
      "brand": "Philips Healthcare",
      "type": "Monitor multiparámetro",
      "status": "OPERATIVO",
      "maintenance_frequency_days": 90,
      "last_maintenance": "2026-08-10",
      "location": {
        "id": 1,
        "name": "Hospital Central San Salvador"
      }
    }
  ]
}
```

#### C. Actualizar Estado Operativo (PUT `/api/v1/equipment/1`)
* **Request Payload (JSON):**
```json
{
  "status": "EN_MANTENIMIENTO",
  "notes": "Alarma intermitente en sensor SpO2, transferido a taller biomédico."
}
```
* **Response Payload (HTTP 200 OK):**
```json
{
  "success": true,
  "message": "Equipo actualizado exitosamente",
  "data": {
    "id": 1,
    "serial_number": "MX450-2026-SV01",
    "status": "EN_MANTENIMIENTO",
    "notes": "Alarma intermitente en sensor SpO2, transferido a taller biomédico."
  }
}
```

#### D. Eliminar Equipo Dado de Baja (DELETE `/api/v1/equipment/1`)
* *Protegido con middleware `authorize('ADMIN')`.*
* **Response Payload (HTTP 200 OK):**
```json
{
  "success": true,
  "message": "Equipo eliminado exitosamente"
}
```

---

### 3.2. CRUD 2: Órdenes de Mantenimiento (`/api/v1/work-orders`)

#### A. Crear Orden de Mantenimiento (POST `/api/v1/work-orders`)
* **Request Payload (JSON):**
```json
{
  "equipment_id": 1,
  "type": "PREVENTIVO",
  "priority": "ALTA",
  "assigned_to": 2,
  "scheduled_date": "2026-11-15",
  "description": "Mantenimiento preventivo trimestral reglamentario.",
  "checklist": [
    "Prueba de seguridad eléctrica IEC 60601-1",
    "Calibración de módulo NIBP",
    "Inspección de batería de respaldo Li-Ion",
    "Verificación de alarmas acústicas y visuales"
  ]
}
```
* **Response Payload (HTTP 201 Created):**
```json
{
  "success": true,
  "message": "Orden de trabajo creada exitosamente",
  "data": {
    "id": 101,
    "equipment_id": 1,
    "type": "PREVENTIVO",
    "priority": "ALTA",
    "status": "PENDIENTE",
    "assigned_to": 2,
    "scheduled_date": "2026-11-15",
    "description": "Mantenimiento preventivo trimestral reglamentario.",
    "equipment": {
      "id": 1,
      "model": "IntelliVue MX450",
      "brand": "Philips Healthcare"
    },
    "technician": {
      "id": 2,
      "name": "Carlos Méndez"
    }
  }
}
```

#### B. Actualizar Progreso, Diagnóstico y Repuestos (PUT `/api/v1/work-orders/101`)
* **Request Payload (JSON):**
```json
{
  "status": "EN_PROGRESO",
  "diagnosis": "Batería interna con capacidad de retención al 35%. Se efectúa reemplazo preventivo.",
  "spare_parts_used": [
    {
      "name": "Batería Recargable Li-Ion 11.1V",
      "quantity": 1,
      "unit": "unidad"
    }
  ]
}
```
* **Response Payload (HTTP 200 OK):**
```json
{
  "success": true,
  "message": "Orden de trabajo actualizada",
  "data": {
    "id": 101,
    "status": "EN_PROGRESO",
    "diagnosis": "Batería interna con capacidad de retención al 35%. Se efectúa reemplazo preventivo."
  }
}
```

#### C. Cerrar Orden de Trabajo (PATCH `/api/v1/work-orders/101/close`)
* **Request Payload (JSON):**
```json
{
  "diagnosis": "Mantenimiento completado con éxito. Pruebas de fuga y calibración aprobadas.",
  "notes": "Próximo mantenimiento programado para dentro de 90 días."
}
```
* **Response Payload (HTTP 200 OK):**
```json
{
  "success": true,
  "message": "Orden de trabajo cerrada exitosamente",
  "data": {
    "id": 101,
    "status": "COMPLETADA",
    "completed_date": "2026-11-06"
  }
}
```

---

## ⭐ LÓGICA CORE DE NEGOCIO (Diferenciador del Desarrollador 2)

El aspecto más relevante del rol consiste en evitar que el mantenimiento preventivo sea un registro estático, transformándolo en un **motor inteligente y automatizado**:

### 4.1. Algoritmo de Cálculo Dinámico de Fechas Preventivas
Implementado en `src/services/maintenanceService.js`. El cálculo procesa la fecha de la última intervención junto con la frecuencia especificada en el plan del equipo (`FrecuenciaValor` y `FrecuenciaUnidad`):

$$\text{FechaPróxima} = \text{FechaÚltimoMantenimiento} + (\text{FrecuenciaValor} \times \text{FrecuenciaUnidad})$$
$$\text{DíasRestantes} = \text{FechaPróxima} - \text{FechaActual}$$

* **Criterios de Estado:**
  - Si $\text{DíasRestantes} < 0$: El estado se cataloga como **`VENCIDO`** (marcador rojo, criticidad alta).
  - Si $0 \le \text{DíasRestantes} \le 7$: El estado se cataloga como **`PRÓXIMO`** (marcador ámbar, listo para generación de orden).
  - Si $\text{DíasRestantes} > 7$: El estado se cataloga como **`AL DÍA`** (marcador verde).

### 4.2. Generador Automático de Órdenes de Trabajo sin Duplicados
Disponible vía `POST /api/v1/maintenance/generate-orders`:
1. Evalúa en tiempo real todos los equipos activos y sus planes de mantenimiento asociados.
2. Filtra automáticamente aquellos equipos que se encuentren en estado **`VENCIDO`** o **`PRÓXIMO`** ($\le 7$ días).
3. **Control de Duplicidad:** Antes de insertar, el algoritmo consulta `OrdenesMantenimiento` para verificar si el equipo ya cuenta con una orden preventiva abierta en estado `PENDIENTE` o `EN_PROGRESO`.
4. Si ya existe, se omite y se registra en la lista de excepciones informativas. Si no existe, se crea la nueva orden de tipo `PREVENTIVO` con prioridad calculada (`ALTA` si está vencida, `MEDIA` si es próxima) y fecha programada.
5. Retorna un informe consolidado:
   ```json
   {
     "success": true,
     "message": "Proceso de generación de órdenes preventivas completado",
     "summary": {
       "total_evaluated": 15,
       "needs_maintenance": 4,
       "orders_created": 3,
       "skipped": 1
     }
   }
   ```

---

## ☁️ CRITERIO 3: INFRAESTRUCTURA AWS CLOUD Y SEGURIDAD (25%)

### 5.1. Almacenamiento Seguro en Amazon S3 (`src/services/documentService.js`)
Para cumplir con los lineamientos de almacenamiento de manuales y fichas técnicas en PDF sin saturar la base de datos relacional:
- Se implementó la subida binaria mediante el SDK oficial `@aws-sdk/client-s3` (`PutObjectCommand`).
- **Seguridad en descargas:** Los archivos en S3 no tienen acceso público directo. Se utiliza `@aws-sdk/s3-request-presigner` (`getSignedUrl`) para generar **URLs temporales prefirmadas** con tiempo de vida limitado (15 minutos). De esta forma, el bucket se mantiene 100% privado.

```javascript
// Generación de URL prefirmada para descarga temporal segura
export const getDownloadUrl = async (id) => {
  const document = await Document.findByPk(id);
  if (!document) throw new AppError('Documento no encontrado', 404);

  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: document.s3_key,
  });

  const downloadUrl = await getSignedUrl(s3Client, command, { expiresIn: 900 });
  return { downloadUrl, document };
};
```

### 5.2. Control de Acceso Granular (AWS IAM / RBAC)
La API implementa un modelo de autorización basado en roles (**Role-Based Access Control**):
- **`ADMIN`**: Control total del sistema. Único rol autorizado para ejecutar operaciones de borrado (`DELETE /equipment/:id`, `DELETE /history/:id`, `DELETE /locations/:id`, etc.).
- **`SUPERVISOR`**: Visualización general, creación y actualización de órdenes y programación.
- **`TECNICO`**: Acceso limitado a sus órdenes asignadas, actualización de diagnósticos y registro de bitácora técnica.

### 5.3. Gestión de Secretos y Variables de Entorno (`.env`)
Se configuró una estricta política de confidencialidad:
- **Cero credenciales en código:** Ninguna contraseña, llave de AWS o secreto JWT está quemado en el código fuente.
- Se incluye `.env.example` en el repositorio para que cualquier evaluador o miembro del equipo conozca la estructura requerida sin comprometer claves reales.

---

## 🎨 CRITERIO 4: ALINEACIÓN CON EL DISEÑO FRONTEND (25%)

Los endpoints desarrollados fueron diseñados para mapear de forma unívoca con las pantallas de la interfaz **MedControl** (React + Vite + Tailwind CSS):

```
┌─────────────────────────────────┐       ┌─────────────────────────────────┐
│     PANTALLAS FRONTEND (UI)     │       │       ENDPOINTS API BACKEND     │
├─────────────────────────────────┤       ├─────────────────────────────────┤
│ 1. Dashboard / Inicio           │ ◄───► │ GET  /api/v1/dashboard/stats    │
│ 2. Inventario de Equipos        │ ◄───► │ GET  /api/v1/equipment          │
│ 3. Ficha Técnica Modal          │ ◄───► │ GET  /api/v1/equipment/:id      │
│ 4. Cronograma / Calendario      │ ◄───► │ GET  /api/v1/maintenance/sched  │
│ 5. Órdenes de Trabajo           │ ◄───► │ GET  /api/v1/work-orders        │
│ 6. Diagnóstico y Cierre         │ ◄───► │ PATCH/api/v1/work-orders/:id/cl │
│ 7. Historial Técnico            │ ◄───► │ GET  /api/v1/history            │
│ 8. Sedes y Ubicaciones          │ ◄───► │ GET  /api/v1/locations          │
│ 9. Biblioteca de Documentos S3  │ ◄───► │ GET  /api/v1/documents/:id/down │
└─────────────────────────────────┘       └─────────────────────────────────┘
```

---

## 📦 ENTREGABLES FÍSICOS Y ARCHIVOS DE PRUEBA

En el repositorio se encuentran disponibles:
1. **Colección Postman exportada:** [MedControl-API.postman_collection.json](file:///home/douglasmo/.gemini/antigravity/scratch/Proyecto/backend/MedControl-API.postman_collection.json)  
   *Lista para importar en Postman con variables de entorno precargadas (`{{baseUrl}}`, `{{token}}`) y scripts automáticos de captura de token JWT.*
2. **Documentación Swagger / OpenAPI 3.0:** Accesible localmente en `http://localhost:3000/api-docs` con consola interactiva para probar cada endpoint.
3. **Código fuente documentado:** 57 archivos con arquitectura en capas en la rama `feature/backend-maintenance-api`.

---

## 🏁 CONCLUSIÓN

El avance presentado cubre a cabalidad los 4 rubros estipulados en la rúbrica de evaluación para el **Laboratorio del Sábado 7 de Noviembre de 2026**:
- Se ha provisto un backend robusto, modular y testeado.
- Se implementó la lógica de cálculo preventivo y generación automática de órdenes requerida para el rol de **Desarrollador 2**.
- Se cuenta con control de versiones transparente mediante 10 commits trazables en GitHub.
- Se garantiza la integración con la base de datos relacional de Miguel Arévalo, el frontend de Julio Herrera y la nube AWS Free Tier.
