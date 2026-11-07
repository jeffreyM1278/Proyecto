# MedControl

Sistema de demostración para la gestión de mantenimiento preventivo de equipos médicos e industriales. El proyecto incluye una API backend y una interfaz frontend.

## Estructura

- `backend/`: API REST en Node.js y Express. Administra equipos, usuarios, sedes, órdenes de trabajo, mantenimientos, historial y documentos.
- `frontend/`: interfaz web en React y Vite con panel, inventario, cronograma, órdenes y otros módulos.

## Ejecutar el frontend

Requiere Node.js 20 o superior.

```bash
cd frontend
npm install
npm run dev
```

Vite muestra la dirección local en la terminal, normalmente `http://localhost:5173`.

## Ejecutar el backend

Requiere Node.js, npm y una base de datos configurada. Consulta [`backend/README.md`](./backend/README.md) para crear el archivo `.env` y arrancar la API.

La documentación interactiva de la API está disponible en `/api-docs` cuando el backend está en marcha.

## Estado de integración

El frontend incluido es un prototipo académico: utiliza datos ficticios guardados en `localStorage` y una sesión de demostración en `sessionStorage`. **No está conectado al backend** y su inicio de sesión no autentica usuarios reales. Los módulos de documentos tampoco suben archivos a S3 desde esta interfaz.

El backend y el frontend deben integrarse mediante servicios HTTP antes de usar el sistema con datos reales. No se deben tratar los datos locales ni el inicio de sesión de demostración como mecanismos de seguridad.
