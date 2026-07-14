# Mapeo del frontend PIT

Este documento relaciona la estructura implementada con la referencia de `specs/estructura_frontend.md` y con la planificación de la feature `002-frontend-initial-setup`.

## Mapeo de estructura

| Elemento de referencia | Implementación actual | Estado |
| --- | --- | --- |
| `src/components/` | `Frontend/src/components/Nav.jsx` | Implementado |
| `src/contexts/` | `Frontend/src/contexts/.gitkeep` | Preparado |
| `src/hooks/` | `Frontend/src/hooks/.gitkeep` | Preparado |
| `src/pages/UserProfile/` | `Frontend/src/pages/UserProfile/UserProfile.jsx` | Implementado |
| `src/pages/` | `Frontend/src/pages/Home/Home.jsx`, `Frontend/src/pages/About/About.jsx`, `Frontend/src/pages/UserProfile/UserProfile.jsx` | Implementado |
| `src/routes/routes.jsx` | `Frontend/src/routes/routes.jsx` | Implementado |
| `src/services/` | `Frontend/src/services/httpClient.js` y carpetas por módulo | Implementado |
| `src/utils/` | `Frontend/src/utils/.gitkeep` | Preparado |
| `src/App.jsx` | `Frontend/src/App.jsx` | Implementado |
| `src/index.js` | `Frontend/src/index.jsx` | Implementado con el entrypoint real |
| `public/` | `Frontend/public/.gitkeep` | Preparado |

## Criterios aplicados

- Rutas iniciales para `/`, `/about` y `/profile`.
- Navegación visible desde el primer arranque.
- Servicios HTTP separados por dominio.
- Punto de entrada compatible con Vite y React Router.

## Preparación para evolución

La estructura actual deja espacio para agregar más adelante:

- `src/contexts/` para estado global.
- `src/hooks/` para lógica reutilizable.
- `src/utils/` para utilidades compartidas.
- pruebas unitarias y de integración de rutas o servicios.

## Relación con la planificación

La implementación actual cubre la base técnica, la navegación y la documentación mínima requerida por la feature. Los siguientes pasos naturales son ampliar formularios, consumir endpoints reales y agregar pruebas sobre rutas y servicios.