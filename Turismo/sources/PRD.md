# PRD — PIT (Plataforma Interactiva de Turismo)

**Fecha**: 2026-06-22
**Estado**: Activo
**Version**: 1.0

---

## 1. Resumen Ejecutivo

PIT es una plataforma web interactiva diseñada para facilitar la planificación, exploración y gestión de actividades turísticas en la ciudad de Loja, Ecuador. La plataforma integra un mapa interactivo, gestión de atractivos turísticos, rutas, inventarios, investigación y geolocalización en una sola aplicación modular, accesible desde navegadores de escritorio y dispositivos móviles.

---

## 2. Objetivos

### 2.1 Objetivo General
Brindar información turística relevante y actualizada sobre lugares de interés, restaurantes, monumentos históricos, actividades y puntos de interés en Loja, permitiendo a turistas y gestores administrar contenidos turísticos de forma eficiente.

### 2.2 Objetivos Específicos
- Visualizar un mapa interactivo con información turística por cantón.
- Registrar, editar y publicar atractivos turísticos georreferenciados.
- Integrar rutas turísticas dentro del mapa interactivo.
- Administrar fichas digitales del inventario turístico.
- Importar información desde archivos Excel.
- Publicar infografías y materiales visuales por cantón o producto turístico.
- Publicar resultados de proyectos de investigación.
- Integrar servicios externos de clima (INAMI) y estado de vías (ECU 911).
- Gestionar usuarios, roles y permisos.
- Ofrecer una experiencia responsive y accesible.

---

## 3. Actores del Sistema

| Actor | Descripción | Permisos Principales |
|-------|-------------|---------------------|
| **Administrador** | Control total de la plataforma | CRUD completo, gestión de usuarios y roles |
| **Gestor Territorial** | Gestiona información territorial y administrativa | CRUD de geolocalización y atractivos |
| **Gestor Turístico** | Gestiona contenido turístico y rutas | CRUD de atractivos, rutas e inventario |
| **Investigador** | Valida y gestiona contenidos de investigación | CRUD de investigación y validación de contenidos |
| **Turista** | Consulta información turística | Lectura, favoritos, valoraciones, perfil |

---

## 4. Arquitectura del Sistema

### 4.1 Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| **Frontend** | React 18, React Router v6, Axios, Tailwind CSS, Vite |
| **Backend** | Django 6.0, Django REST Framework, drf-spectacular |
| **Base de Datos** | SQLite (desarrollo), PostgreSQL (producción) |
| **Autenticación** | JWT (djangorestframework-simplejwt) |
| **Mapas** | Leaflet |
| **Estilos** | Tailwind CSS con arquitectura cromática 60-30-10 |

### 4.2 Arquitectura Modular

```
Turismo/
├── apps/                    # Backend Django (API REST)
│   ├── usuarios/            # Autenticación, roles, perfiles
│   ├── atractivos/          # Atractivos turísticos, rutas, servicios
│   ├── geolocalizacion/     # Jerarquía geográfica
│   ├── inventario/          # Recursos multimedia
│   └── investigacion/       # Proyectos de investigación
├── config/                  # Configuración Django
├── core/                    # Utilidades compartidas
├── Frontend/                # Frontend React (SPA)
│   └── src/
│       ├── components/      # Componentes reutilizables
│       ├── context/         # Contextos (AuthContext)
│       ├── layouts/         # Layouts (Layout, AdminLayout)
│       ├── pages/           # Páginas por módulo
│       ├── services/        # Cliente HTTP (Axios)
│       └── styles/          # Estilos globales (Tailwind)
└── sources/                 # Documentación
```

### 4.3 Comunicación Frontend-Backend

- **Protocolo**: HTTP/JSON
- **URL Base API**: `http://localhost:8000/api` (configurable via `VITE_API_URL`)
- **CORS**: Habilitado para desarrollo (`CORS_ALLOW_ALL_ORIGINS = True`)
- **Formato de Respuesta Estándar**:

```json
{
  "success": true,
  "message": "Operación exitosa",
  "data": { ... },
  "errors": null,
  "meta": { ... }
}
```

---

## 5. Módulos Funcionales

### 5.1 Módulo de Usuarios
**Endpoint base**: `/api/usuarios/`

Gestiona autenticación, autorización, perfiles y roles del sistema.

**Funcionalidades**:
- Registro de usuarios nuevos
- Inicio de sesión con JWT (access + refresh tokens)
- Gestión de perfiles (nombre, apellido, correo, teléfono, país)
- Sistema de roles: ADMINISTRADOR, GESTOR_TERRITORIAL, GESTOR_TURISTICO, INVESTIGADOR, TURISTA
- Valoraciones y favoritos de atractivos
- Historial de visitas y períodos de visita
- Trazabilidad de modificaciones

**Endpoints principales**:
| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/usuarios/registro/` | Registro de usuarios |
| POST | `/api/usuarios/login/` | Inicio de sesión JWT |
| POST | `/api/usuarios/refresh-token/` | Renovación de token |
| GET/POST | `/api/usuarios/perfiles/` | Listar/crear perfiles |
| GET/POST | `/api/usuarios/perfiles/{id}/valoraciones/` | Valoraciones de atractivos |
| GET/POST | `/api/usuarios/perfiles/{id}/favoritos/` | Favoritos de atractivos |

---

### 5.2 Módulo de Atractivos Turísticos
**Endpoint base**: `/api/atractivos/`

Gestiona el catálogo completo de atractivos turísticos de la ciudad.

**Funcionalidades**:
- CRUD de atractivos turísticos georreferenciados
- Clasificación por categorías, tipos y subtipos
- Gestión de servicios asociados (costo, disponibilidad)
- Horarios de atención (normal, fin de semana, feriado, especial)
- Información climática por atractivo
- Rutas turísticas con puntos intermedios (DetalleRuta)
- Estados de conservación: CONSERVADO, ALTERADO, EN_DETERIORO, DETERIORADO
- Niveles de accesibilidad: LIBRE, RESTRINGIDO, PAGADO
- Estados de ruta: BUENA, REGULAR, MALA, CERRADA

**Endpoints principales**:
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET/POST | `/api/atractivos/atractivos/` | Listar/crear atractivos (filtros: clasificacion, estado_conservacion, nivel_accesibilidad) |
| GET/PUT/PATCH/DELETE | `/api/atractivos/atractivos/{id}/` | Operaciones sobre un atractivo |
| GET/POST | `/api/atractivos/clasificaciones/` | Clasificaciones de atractivos |
| GET/POST | `/api/atractivos/servicios/` | Servicios asociados |
| GET/POST | `/api/atractivos/horarios/` | Horarios de atención |
| GET/POST | `/api/atractivos/rutas/` | Rutas turísticas |

---

### 5.3 Módulo de Geolocalización
**Endpoint base**: `/api/geolocalizacion/`

Administra la jerarquía geográfica del territorio.

**Funcionalidades**:
- Gestión de la jerarquía: País → Provincia → Cantón → Parroquia → Sector
- Mapas asociados a cantones
- Consulta de jerarquía geográfica completa
- Filtrado por entidad geográfica

**Jerarquía**:
```
Ecuador
└── Loja
    ├── Loja
    │   ├── Centro
    │   │   ├── sector1
    │   │   └── sector2
    │   └── ...
    ├── Catamayo
    └── ...
```

**Endpoints principales**:
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET/POST | `/api/geolocalizacion/paises/` | Gestión de países |
| GET/POST | `/api/geolocalizacion/provincias/` | Gestión de provincias (filtro: `?pais=`) |
| GET/POST | `/api/geolocalizacion/cantones/` | Gestión de cantones (filtro: `?provincia=`) |
| GET/POST | `/api/geolocalizacion/parroquias/` | Gestión de parroquias (filtro: `?canton=`) |
| GET/POST | `/api/geolocalizacion/sectores/` | Gestión de sectores (filtro: `?parroquia=`) |
| GET | `/api/geolocalizacion/jerarquia/` | Jerarquía completa |

---

### 5.4 Módulo de Inventario
**Endpoint base**: `/api/inventario/`

Gestiona recursos multimedia asociados a atractivos turísticos.

**Funcionalidades**:
- CRUD de recursos (imágenes, videos, documentos, infografías)
- Importación masiva desde archivos Excel (CSV/XLSX)
- Asociación de recursos a atractivos turísticos
- Tipos de recurso: IMAGEN, VIDEO, DOCUMENTO, INFOGRAFIA

**Endpoints principales**:
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET/POST | `/api/inventario/recursos/` | Listar/subir recursos |
| GET/PUT/PATCH/DELETE | `/api/inventario/recursos/{id}/` | Gestión de un recurso |
| POST | `/api/inventario/recursos/importar/` | Importar desde Excel |

---

### 5.5 Módulo de Investigación
**Endpoint base**: `/api/investigacion/`

Gestiona proyectos de investigación y sus evidencias.

**Funcionalidades**:
- CRUD de proyectos de investigación
- Gestión de actores (organizaciones participantes)
- Registro de evidencias (productos, resultados, aprendizajes)
- Planes de acción con fechas
- Evaluación de impactos
- Estados de evidencia: PRODUCTO, RESULTADO, APRENDIZAJE

**Endpoints principales**:
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET/POST | `/api/investigacion/proyectos/` | Listar/crear proyectos |
| POST | `/api/investigacion/proyectos/{id}/actores/` | Agregar actor |
| POST | `/api/investigacion/proyectos/{id}/evidencias/` | Agregar evidencia |
| POST | `/api/investigacion/proyectos/{id}/planes-accion/` | Agregar plan de acción |
| POST | `/api/investigacion/proyectos/{id}/impactos/` | Agregar impacto |

---

## 6. Requisitos Funcionales

| ID | Requisito |
|----|-----------|
| RF-01 | Visualizar un mapa interactivo general de la provincia con información turística por cantón |
| RF-02 | Registrar, editar y publicar atractivos turísticos georreferenciados |
| RF-03 | Integrar rutas turísticas dentro del mapa interactivo |
| RF-04 | Administrar fichas digitales del inventario turístico |
| RF-05 | Importar o registrar información proveniente de archivos Excel |
| RF-06 | Publicar infografías y materiales visuales por cantón o producto turístico |
| RF-07 | Registrar y mostrar información del perfil del turista |
| RF-08 | Publicar resultados de proyectos de investigación y vinculación |
| RF-09 | Asociar contenidos a cantones, rutas, atractivos o categorías temáticas |
| RF-10 | Integrar enlaces externos relacionados con clima, estado de vías, GAD cantonales |
| RF-11 | Búsquedas y filtros por cantón, atractivo, ruta, categoría o servicio |
| RF-12 | Administrar usuarios, roles y permisos |
| RF-13 | Gestionar estados de contenido: borrador, revisión, publicado o archivado |
| RF-14 | Consultar la plataforma desde navegadores y dispositivos móviles |
| RF-15 | Generar vistas públicas y vistas administrativas diferenciadas |
| RF-16 | Adjuntar imágenes, documentos y recursos multimedia a cada registro |
| RF-17 | Mantener trazabilidad básica de actualizaciones de contenido |

---

## 7. Requisitos No Funcionales

| ID | Requisito |
|----|-----------|
| RNF-01 | **Usabilidad**: Plataforma visual, intuitiva e interactiva para usuarios académicos y público general |
| RNF-02 | **Accesibilidad**: Navegación clara, legible y adaptable a distintos dispositivos (WCAG) |
| RNF-03 | **Compatibilidad**: Funcionar en navegadores modernos, computadoras, tablets y teléfonos móviles |
| RNF-04 | **Rendimiento**: Cargar mapas, fichas y contenidos visuales de manera oportuna |
| RNF-05 | **Escalabilidad**: Incorporar nuevos cantones, rutas, módulos e indicadores sin rediseño completo |
| RNF-06 | **Mantenibilidad**: Facilitar la actualización periódica de la información turística |
| RNF-07 | **Seguridad**: Restringir acceso a funciones administrativas mediante autenticación y permisos |
| RNF-08 | **Interoperabilidad**: Integrarse con servicios externos de mapas, clima, estado de vías |
| RNF-09 | **Portabilidad**: Experiencia coherente entre entorno web y dispositivos móviles |
| RNF-10 | **Disponibilidad**: Plataforma disponible para consulta pública y gestión institucional |

---

## 8. Restricciones Técnicas

- Arquitectura modular obligatoria (cada módulo = app Django independiente)
- Clean Architecture en el backend
- Serializers DRF para validación y transformación
- ViewSets para endpoints REST
- Documentación OpenAPI via drf-spectacular
- No exponer tokens, credenciales, stack traces ni datos sensibles
- Validar entradas y permisos en los límites de la API
- Manejo controlado de errores sin exponer información sensible
- Convenciones: snake_case, servicios separados de views

---

## 9. Estilo Visual y Diseño

### 9.1 Principios de Diseño
- Moderno, limpio, profesional, accesible, responsivo, consistente, escalable
- Transmitir: confianza, orden, seguridad, eficiencia, claridad

### 9.2 Arquitectura Cromática (60-30-10)

| Porcentaje | Uso | Color |
|-----------|-----|-------|
| **60%** | Fondos, superficies, tarjetas, tablas | Neutros (blanco/gris claro) |
| **20%** | Color principal: identidad, navegación activa, botones primarios | `#2563EB` |
| **10%** | Color secundario: navegación secundaria, bordes, metadatos | `#64748B` |
| **Acento** | Llamadas a la acción especiales, foco visual | `#10B981` |

### 9.3 Colores Semánticos

| Estado | Color | Uso |
|--------|-------|-----|
| Success | `#16A34A` | Éxito, aprobado, completado |
| Warning | `#F59E0B` | Advertencia, pendiente |
| Danger | `#DC2626` | Error, crítico, restringido |
| Info | `#0EA5E9` | Información, ayuda |

### 9.4 Componentes UI
- **Átomos**: botones, inputs, selects, badges, iconos, tooltips
- **Moléculas**: buscadores, filtros, cards de indicador, paginación
- **Organismos**: header, menú lateral, tablas, formularios por pasos, dashboards
- **Plantillas**: layout de dashboard, listado, formulario, detalle, reporte

---

## 10. Flujo de Navegación

### 10.1 Rutas Públicas
| Ruta | Página |
|------|--------|
| `/` | Home (página principal) |
| `/acerca` | Acerca de |
| `/login` | Inicio de sesión |
| `/register` | Registro de usuario |

### 10.2 Rutas Protegidas (Requieren autenticación)
| Ruta | Página |
|------|--------|
| `/dashboard` | Dashboard principal |
| `/perfil` | Perfil de usuario |
| `/settings` | Configuración |
| `/lista-atractivos` | Lista de atractivos turísticos |
| `/detalle-atractivo/:id` | Detalle de un atractivo |
| `/registro-atractivo` | Registro de nuevo atractivo |
| `/editar-atractivo/:id` | Editar atractivo |
| `/explorador` | Explorador de atractivos |
| `/rutas` | Mapa de rutas turísticas |
| `/publicaciones` | Publicaciones |
| `/reportes` | Reportes |
| `/investigacion` | Módulo de investigación |
| `/geolocalizacion` | Geolocalización |
| `/usuarios` | Gestión de usuarios |

### 10.3 Rutas de Administración (Protegidas)
| Ruta | Página |
|------|--------|
| `/admin/usuarios` | Administración de usuarios |
| `/admin/paises` | Gestión de países |
| `/admin/provincias` | Gestión de provincias |
| `/admin/cantones` | Gestión de cantones |
| `/admin/parroquias` | Gestión de parroquias |
| `/admin/sectores` | Gestión de sectores |
| `/admin/atractivos` | Gestión de atractivos |
| `/admin/clasificaciones` | Gestión de clasificaciones |
| `/admin/reportes` | Reportes administrativos |
| `/admin/investigacion` | Investigación |

---

## 11. Integraciones Externas

### 11.1 INAMI (Servicio de Clima)
- **Tipo**: REST API
- **Parámetros**: Latitud, longitud
- **Respuesta**: Temperatura, precipitación, humedad, condiciones
- **Caché**: 1 hora (evitar rate limiting)

### 11.2 ECU 911 (Estado de Vías)
- **Tipo**: REST API
- **Parámetros**: Segmento de vía, coordenadas
- **Respuesta**: Estado (abierto/cerrado), alertas de seguridad, incidentes
- **Frecuencia**: Actualización cada 30 minutos

---

## 12. Seguridad

- Autenticación JWT con access y refresh tokens
- Tokens almacenados en localStorage (frontend)
- Renovación automática de tokens via interceptor Axios
- Roles y permisos por endpoint
- CORS configurado para dominios específicos en producción
- No exponer datos sensibles en logs, UI o documentación
- Validación de entradas en todos los límites de la API
- Manejo controlado de errores

---

## 13. Criterios de Aceptación

### 13.1 MVP (Mínimo Viable)
- [ ] Autenticación JWT completa (registro, login, refresh)
- [ ] CRUD de atractivos turísticos con geolocalización
- [ ] Mapa interactivo con Leaflet mostrando atractivos
- [ ] Gestión de jerarquía geográfica ( País → Provincia → Cantón → Parroquia → Sector )
- [ ] CRUD de rutas turísticas asociadas a atractivos
- [ ] CRUD de recursos multimedia
- [ ] Importación de recursos desde Excel
- [ ] CRUD de proyectos de investigación
- [ ] Panel de administración con roles diferenciados
- [ ] Diseño responsive (escritorio + móvil)
- [ ] Documentación OpenAPI (Swagger)

### 13.2 Criterios de Calidad
- [ ] Sin errores de consola en el frontend
- [ ] Tiempo de carga inicial < 3 segundos
- [ ] Cobertura de endpoints documentada en Swagger
- [ ] Formularios con validación inline
- [ ] Estados de carga, vacío y error implementados
- [ ] Accesibilidad WCAG 2.1 nivel AA

---

## 14. Consideraciones Futuras

- App móvil nativa (React Native) para turistas
- Integración en tiempo real con INAMI y ECU 911
- Sistema de notificaciones push
- Mapas offline para dispositivos móviles
- Multiidioma (incluyendo español e inglés)
- Analytics y métricas de uso
- Exportación de reportes en PDF
- Sistema de caché con Redis
- Deploy con Docker y CI/CD
