# Frontend PIT

Aplicación SPA en React + Vite para el proyecto PIT. Esta base está preparada para crecer por módulos y consumir el backend Django mediante servicios HTTP centralizados.

## Instalación

```powershell
npm install
```

## Ejecución local

```powershell
npm run dev
```

Para generar una compilación de producción:

```powershell
npm run build
```

Para previsualizar la compilación:

```powershell
npm run preview
```

## Variables de entorno

El frontend usa la variable siguiente:

- `VITE_API_BASE_URL`: URL base del backend Django. Si no se define, el cliente HTTP usa `http://localhost:8000` como respaldo.

Ejemplo de archivo local:

```env
VITE_API_BASE_URL=http://localhost:8000
```

## Estructura

La estructura implementada sigue la referencia de `specs/estructura_frontend.md` y la planificación de `specs/002-frontend-initial-setup/plan.md`.

- `src/components/`: componentes reutilizables de UI.
- `src/contexts/`: base para estado global compartido.
- `src/hooks/`: base para hooks reutilizables.
- `src/pages/`: vistas de ruta.
- `src/routes/`: definición del router.
- `src/services/`: cliente HTTP y servicios por módulo.
- `src/utils/`: utilidades compartidas.
- `src/styles/`: estilos globales.
- `src/App.jsx`: layout semántico principal.
- `src/index.jsx`: punto de entrada de React.
- `public/`: carpeta estática para recursos públicos.

## Rutas iniciales

- `/`: pantalla principal.
- `/about`: información de la base del frontend.
- `/profile`: perfil base de usuario.

La navegación se implementa con `react-router-dom` mediante un layout padre con `Outlet`.

## Relación con el backend

El frontend no incluye lógica HTTP dentro de las páginas. La integración con Django se centraliza en `src/services/httpClient.js` y en los módulos por dominio:

- `src/services/usuarios/`
- `src/services/atractivos/`
- `src/services/geolocalizacion/`
- `src/services/inventario/`
- `src/services/investigacion/`

Cada módulo debe consumir la API desde su propio servicio para mantener trazabilidad y separar responsabilidades.

## Despliegue

La estrategia recomendada para esta base es compilar la SPA y desplegarla como sitio estático independiente. En producción también puede servirse detrás de Nginx o integrarse con Django, pero esa decisión queda fuera del alcance inicial.

## Convención de ramas

La rama de esta feature sigue el formato de especificación:

- `002-frontend-initial-setup`

## Referencias

- `specs/002-frontend-initial-setup/spec.md`
- `specs/002-frontend-initial-setup/plan.md`
- `specs/002-frontend-initial-setup/tasks.md`
- `specs/estructura_frontend.md`