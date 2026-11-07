# MedControl — Frontend

Interfaz de demostración para el **Sistema de Gestión de Mantenimiento Preventivo de Equipos Médicos / Industriales** (Proyecto 8).

## Tecnologías
- React 18 + Vite 6
- Tailwind CSS 3
- React Router 6
- Lucide React

## Instalación
Requiere Node.js 20 o superior.

```bash
npm install
npm run dev
```

Abre la URL indicada por Vite (normalmente `http://localhost:5173`). Para compilar:

```bash
npm run build
```

## Inicio de sesión
Es una **demostración sin autenticación real**. El formulario precarga `admin@medcontrol.demo` y `demo123`; acepta cualquier correo válido y contraseña no vacía.

## Pantallas
Inicio de sesión, Dashboard, Inventario de equipos, Ficha técnica, Cronograma, Órdenes de trabajo, Historial técnico, Sedes, Documentos, Usuarios y Configuración.

## Datos y limitaciones
- Usa datos ficticios y `localStorage`; los cambios persisten en el navegador.
- El inicio de sesión usa `sessionStorage`, no seguridad real.
- El calendario muestra órdenes de trabajo según su fecha.
- El módulo Documentos guarda solo referencias, no sube ni descarga PDFs.
- No hay backend, base de datos real, AWS S3, AWS IAM ni autorización real.
- Antes de producción: implementar API, validación del servidor, autenticación, permisos, almacenamiento seguro, manejo de errores y pruebas.

## Estructura
```
src/
  components/  Layout y componentes compartidos
  data/        Datos iniciales ficticios
  pages/       Pantallas y formularios
  utils/       Persistencia local
  main.jsx     Rutas y composición
  index.css    Tailwind y estilos comunes
```

## Conexión futura con backend
Sustituir `src/utils/store.js` por servicios HTTP y un proveedor de estado. No almacenar tokens sensibles en localStorage. Coordinar contratos de API con el equipo backend.
