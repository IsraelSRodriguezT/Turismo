# Documentación — PIT (Plataforma Interactiva Turística)

Fecha: 2026-06-22

## 1. Contexto del proyecto

PIT es una plataforma digital orientada a facilitar la planificación, exploración y gestión de actividades turísticas en distintos destinos dentro de la ciudad de Loja.

El objetivo general es brindar información relevante y actualizada sobre lugares turísticos, restaurantes, monumentos históricos, actividades y otros puntos de interés.

El sistema permite buscar destinos, ver información detallada, consultar o dejar recomendaciones de otros usuarios y organizar itinerarios según preferencias. Además, incorpora un sistema de traducción en tiempo real para mejorar la experiencia del usuario.

## 2. Instalación rápida

### Backend (Django)

```powershell
py -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Frontend (React + Vite)

```powershell
cd Frontend
npm install
npm run dev
```

> El frontend se ejecutará en `http://localhost:5173` y el backend en `http://localhost:8000`.

## 3. Estructura del proyecto

```
Turismo/
├── apps/                    # Aplicaciones Django (backend)
│   ├── usuarios/
│   ├── atractivos/
│   ├── geolocalizacion/
│   ├── inventario/
│   └── investigacion/
├── config/                  # Configuración Django
├── core/                    # Utilidades compartidas
├── Frontend/                # Aplicación React (frontend)
│   ├── src/
│   │   ├── components/      # Componentes reutilizables
│   │   ├── context/         # Contextos de React (AuthContext)
│   │   ├── layouts/         # Layouts (Layout, AdminLayout)
│   │   ├── pages/           # Páginas de la aplicación
│   │   │   ├── auth/        # Autenticación (Login, Register)
│   │   │   ├── web/         # Páginas públicas/protegidas
│   │   │   └── admin/       # Panel de administración
│   │   ├── services/        # Cliente HTTP (Axios)
│   │   └── styles/          # Estilos globales (Tailwind)
│   ├── .env.example
│   ├── tailwind.config.cjs
│   ├── postcss.config.cjs
│   └── vite.config.js
├── sources/                 # Documentación
├── manage.py
└── requirements.txt
```

## 4. Conexión Frontend ↔ Backend

El frontend se comunica con el backend Django a través de una API REST usando Axios.

- **URL base de la API**: configurable mediante `VITE_API_URL` en `Frontend/.env` (por defecto `http://localhost:8000/api`).
- **CORS**: el backend tiene `CORS_ALLOW_ALL_ORIGINS = True` para desarrollo.
- **Autenticación**: JWT (access + refresh tokens). El interceptor de Axios en `httpClient.js` renueva el token automáticamente si expira.
- **Formato de respuesta**: `{success, message, data, errors, meta}`.

## 5. Esquema OpenAPI / Swagger

- La aplicación usa `drf-spectacular` para generar OpenAPI.
- Esquema raw: `GET /api/schema/`.
- UI interactiva (Swagger): `GET /api/schema/swagger-ui/`.
- Autenticación: JWT con `djangorestframework-simplejwt`.
- Endpoints de token: `POST /api/usuarios/login/` y `POST /api/usuarios/refresh-token/`.
- Respuesta estándar: `{success, message, data, errors, meta}`.

## 6. Rutas principales

### Backend (API Django)

- `admin/` → Django admin.
- `api/schema/` → OpenAPI raw.
- `api/schema/swagger-ui/` → Swagger UI.
- `api/usuarios/` → módulo `usuarios`.
- `api/inventario/` → módulo `inventario`.
- `api/investigacion/` → módulo `investigacion`.
- `api/geolocalizacion/` → módulo `geolocalizacion`.
- `api/atractivos/` → módulo `atractivos`.

### Frontend (React)

**Rutas públicas:**
- `/` → Home (página principal)
- `/acerca` → Acerca de
- `/login` → Inicio de sesión
- `/register` → Registro de usuario

**Rutas protegidas (requieren autenticación):**
- `/dashboard` → Dashboard principal
- `/perfil` → Perfil de usuario
- `/settings` → Configuración
- `/lista-atractivos` → Lista de atractivos turísticos
- `/detalle-atractivo/:id` → Detalle de un atractivo
- `/registro-atractivo` → Registro de nuevo atractivo
- `/editar-atractivo/:id` → Editar atractivo
- `/explorador` → Explorador de atractivos
- `/rutas` → Mapa de rutas turísticas
- `/publicaciones` → Publicaciones
- `/enlaces-externos` → Enlaces externos
- `/importar-recursos` → Importar recursos
- `/reportes` → Reportes
- `/investigacion` → Módulo de investigación
- `/geolocalizacion` → Geolocalización
- `/estados-especiales` → Estados especiales
- `/usuarios` → Gestión de usuarios

**Rutas de administración (protegidas):**
- `/admin/usuarios` → Administración de usuarios
- `/admin/paises` → Gestión de países
- `/admin/provincias` → Gestión de provincias
- `/admin/cantones` → Gestión de cantones
- `/admin/parroquias` → Gestión de parroquias
- `/admin/sectores` → Gestión de sectores
- `/admin/atractivos` → Gestión de atractivos
- `/admin/clasificaciones` → Gestión de clasificaciones
- `/admin/reportes` → Reportes administrativos
- `/admin/investigacion` → Investigación

## 7. Módulo `usuarios`

Archivos: [models.py](Turismo/apps/usuarios/models.py) • [services.py](Turismo/apps/usuarios/services.py) • [serializers.py](Turismo/apps/usuarios/serializers.py) • [views.py](Turismo/apps/usuarios/views.py) • [urls.py](Turismo/apps/usuarios/urls.py)

Modelos principales:

- `Persona` (abstracta)
  - Atributos: `nombre`, `apellido`, `correo`, `telefono`.
  - Relaciones: no aplica.
  - Métodos: no expone métodos propios relevantes.

- `Usuario` (hereda `AbstractBaseUser`, `Persona`)
  - Atributos: `nickname`, `pais_procedencia`, `roles`, `is_active`, `is_staff`, `date_joined`.
  - Relaciones: `pais_procedencia`.
  - Métodos: `get_full_name()`, `get_short_name()`, `tiene_rol()`, `agregar_rol()`, `quitar_rol()`, `set_clave()`, `clean()`, `__str__()`.

- `Perfil`
  - Atributos: `usuario`, `fecha_registro`, `canton`.
  - Relaciones: `usuario`, `canton`.
  - Métodos: `cantidad_visitas`, `puntuacion`, `__str__()`.

- `Valoracion`
  - Atributos: `perfil`, `atractivo_turistico`, `puntuacion`, `comentario`, `fecha_registro`.
  - Relaciones: `perfil`, `atractivo_turistico`.
  - Métodos: `__str__()`.

- `Favorito`
  - Atributos: `perfil`, `atractivo_turistico`, `fecha_guardado`.
  - Relaciones: `perfil`, `atractivo_turistico`.
  - Métodos: `__str__()`.

- `PeriodoVisita`
  - Atributos: `perfil`, `fecha_inicio`, `fecha_fin`.
  - Relaciones: `perfil`.
  - Métodos: `duracion`, `__str__()`.

- `RegistroModificacion`
  - Atributos: `usuario`, `atractivo_turistico`, `accion`, `fecha`, `hora`, `descripcion`, `datos`.
  - Relaciones: `usuario`, `atractivo_turistico`.
  - Métodos: `save()`, `__str__()`.

Services:

- `UsuarioService.crear_usuario(...)` — crea `Usuario` y `Perfil` asociado.
- `autenticar(nickname, clave)` — wrapper sobre `authenticate`.
- `cambiar_clave(usuario, clave_actual, clave_nueva)` — validación y cambio.
- `asegurar_perfil(usuario)` — obtiene o crea `Perfil`.
- `registrar_modificacion(...)` — crea `RegistroModificacion`.
- `PermisoService` — utilidades: `tiene_rol`, `es_admin`, `es_propietario`.

Serializers:

- `UsuarioSerializer`.
- `UsuarioAdminSerializer`.
- `RegistroSerializer`.
- `LoginSerializer`.
- `CambioClaveSerializer`.
- `PerfilSerializer`.
- `ValoracionSerializer`.
- `FavoritoSerializer`.

Views / Endpoints:

- `GET/POST /api/usuarios/perfiles/` — `PerfilViewSet`.
- `GET/POST /api/usuarios/usuarios-admin/` — `UsuarioAdminViewSet`.
- `POST /api/usuarios/registro/` — registro de usuarios.
- `POST /api/usuarios/login/` — login JWT.
- `POST /api/usuarios/refresh-token/` — renovación de token.
- `POST /api/usuarios/cambiar-contrasena/` — cambio de contraseña.
- `GET/POST /api/usuarios/perfiles/{perfil_pk}/valoraciones/` — valoraciones.
- `DELETE /api/usuarios/perfiles/{perfil_pk}/valoraciones/{valoracion_pk}/` — eliminar valoración.
- `GET/POST /api/usuarios/perfiles/{perfil_pk}/favoritos/` — favoritos.
- `DELETE /api/usuarios/perfiles/{perfil_pk}/favoritos/{favorito_pk}/` — eliminar favorito.

## 8. Módulo `atractivos`

Archivos: [models.py](Turismo/apps/atractivos/models.py) • [services.py](Turismo/apps/atractivos/services.py) • [serializers.py](Turismo/apps/atractivos/serializers.py) • [views.py](Turismo/apps/atractivos/views.py) • [urls.py](Turismo/apps/atractivos/urls.py)

Modelos principales:

- `AtractivoTuristico`
  - Atributos: `nombre`, `descripcion`, `nivel_accesibilidad`, `estado_conservacion`.
  - Relaciones: `clasificaciones`, `servicios`, `recomendaciones`, `horarios`, `detalles_ruta`, `gerente`, `ubicacion`.
  - Métodos: `__str__()`.

- `Clasificacion`
  - Atributos: `nombre`, `descripcion`, `nivel`.
  - Relaciones: `atractivo`.
  - Métodos: `__str__()`.

- `Servicio`
  - Atributos: `nombre`, `descripcion`, `esta_disponible`, `costo`.
  - Relaciones: `atractivo_turistico`.
  - Métodos: `__str__()`.

- `Gerente`
  - Atributos: `institucion`, `cargo`.
  - Relaciones: `atractivo_turistico`.
  - Métodos: `__str__()`.

- `Ubicacion`, `Direccion`, `InformacionClimatica`
  - Atributos: coordenadas, dirección y datos climáticos.
  - Relaciones: OneToOne con `AtractivoTuristico` o relación asociada según el modelo.
  - Métodos: `__str__()`.

- `Horario`
  - Atributos: `hora_inicio`, `hora_fin`, `tipo_horario`.
  - Relaciones: `atractivo_turistico`.
  - Métodos: `__str__()`.

- `Ruta` y `DetalleRuta`
  - Atributos: `nombre`, `descripcion`, `nivel_dificultad`, `orden`, `estado`.
  - Relaciones: `ruta`, `atractivo`.
  - Métodos: helpers de consistencia y orden.

Services:

- `AtractivoService.create_atractivo(...)` — crea y sincroniza relaciones.
- `update_atractivo(...)`.
- `list_atractivos(filters)`.

Serializers:

- `AtractivoTuristicoSerializer`.
- `ClasificacionSerializer`.
- `ServicioSerializer`.
- `GerenteSerializer`.
- `HorarioSerializer`.
- `RutaSerializer`.
- `DetalleRutaSerializer`.
- `UbicacionSerializer`.
- `DireccionSerializer`.
- `InformacionClimaticaSerializer`.

Views / Endpoints:

- `GET/POST /api/atractivos/atractivos/` — Lista y crea atractivos turísticos (soporta filtros `clasificacion`, `estado_conservacion`, `nivel_accesibilidad`).
- `GET/PUT/PATCH/DELETE /api/atractivos/atractivos/{id}/` — Operaciones sobre un atractivo específico (retrieve, update, partial_update, destroy).
- `GET/POST /api/atractivos/clasificaciones/` — Lista y crea clasificaciones para atractivos.
- `GET/PUT/PATCH/DELETE /api/atractivos/clasificaciones/{id}/` — Gestión de una clasificación.
- `GET/POST /api/atractivos/servicios/` — Lista y crea servicios asociados a atractivos.
- `GET/PUT/PATCH/DELETE /api/atractivos/servicios/{id}/` — Gestión de un servicio.
- `GET/POST /api/atractivos/gerentes/` — Lista y crea gerentes de atractivos.
- `GET/PUT/PATCH/DELETE /api/atractivos/gerentes/{id}/` — Gestión de un gerente.
- `GET/POST /api/atractivos/horarios/` — Lista y crea horarios de atención.
- `GET/PUT/PATCH/DELETE /api/atractivos/horarios/{id}/` — Gestión de un horario.
- `GET/POST /api/atractivos/rutas/` — Lista y crea rutas relacionadas.
- `GET/PUT/PATCH/DELETE /api/atractivos/rutas/{id}/` — Gestión de una ruta.

## 9. Módulo `geolocalizacion`

Archivos: [models.py](Turismo/apps/geolocalizacion/models.py) • [services.py](Turismo/apps/geolocalizacion/services.py) • [serializers.py](Turismo/apps/geolocalizacion/serializers.py) • [views.py](Turismo/apps/geolocalizacion/views.py) • [urls.py](Turismo/apps/geolocalizacion/urls.py)

Modelos principales:

- `Mapa`
  - Atributos: `nombre`, `canton`.
  - Relaciones: `canton`.
  - Métodos: `__str__()`.

- `Pais`
  - Atributos: `nombre`.
  - Relaciones: `provincias`.
  - Métodos: `__str__()`.

- `Provincia`
  - Atributos: `nombre`, `pais`.
  - Relaciones: `pais`, `cantones`.
  - Métodos: `__str__()`.

- `Canton`
  - Atributos: `nombre`, `provincia`.
  - Relaciones: `provincia`, `parroquias`.
  - Métodos: `__str__()`.

- `Parroquia`
  - Atributos: `nombre`, `canton`.
  - Relaciones: `canton`, `sectores`.
  - Métodos: `__str__()`.

- `Sector`
  - Atributos: `nombre`, `parroquia`.
  - Relaciones: `parroquia`.
  - Métodos: `__str__()`.

Services:

- CRUD de jerarquía geográfica.
- `obtener_jerarquia_geografica()`.

Serializers:

- `MapaSerializer`.
- `PaisSerializer`.
- `ProvinciaSerializer`.
- `CantonSerializer`.
- `ParroquiaSerializer`.
- `SectorSerializer`.
- `JerarquiaGeograficaSerializer`.

Views / Endpoints:

- `GET/POST /api/geolocalizacion/mapas/` — Lista y crea mapas (recursos geográficos asociados a cantones).
- `GET/PUT/PATCH/DELETE /api/geolocalizacion/mapas/{id}/` — Gestión de un mapa.
- `GET/POST /api/geolocalizacion/paises/` — Lista y crea países.
- `GET/PUT/PATCH/DELETE /api/geolocalizacion/paises/{id}/` — Gestión de un país.
- `GET/POST /api/geolocalizacion/provincias/` — Lista y crea provincias (soporta filtro `?pais=`).
- `GET/PUT/PATCH/DELETE /api/geolocalizacion/provincias/{id}/` — Gestión de una provincia.
- `GET/POST /api/geolocalizacion/cantones/` — Lista y crea cantones (soporta filtro `?provincia=`).
- `GET/PUT/PATCH/DELETE /api/geolocalizacion/cantones/{id}/` — Gestión de un cantón.
- `GET/POST /api/geolocalizacion/parroquias/` — Lista y crea parroquias (soporta filtro `?canton=`).
- `GET/PUT/PATCH/DELETE /api/geolocalizacion/parroquias/{id}/` — Gestión de una parroquia.
- `GET/POST /api/geolocalizacion/sectores/` — Lista y crea sectores (soporta filtro `?parroquia=`).
- `GET/PUT/PATCH/DELETE /api/geolocalizacion/sectores/{id}/` — Gestión de un sector.
- `GET /api/geolocalizacion/jerarquia/` — Devuelve la jerarquía geográfica completa (países → provincias → cantones → parroquias).
- `GET /api/geolocalizacion/jerarquia/{id}/` — Devuelve la jerarquía para una entidad identificada por `id`.

## 10. Módulo `inventario`

Archivos: [models.py](Turismo/apps/inventario/models.py) • [services.py](Turismo/apps/inventario/services.py) • [serializers.py](Turismo/apps/inventario/serializers.py) • [views.py](Turismo/apps/inventario/views.py) • [urls.py](Turismo/apps/inventario/urls.py)

Modelos principales:

- `TipoRecurso` (TextChoices)
  - Valores: `IMAGEN`, `VIDEO`, `DOCUMENTO`, `INFOGRAFIA`.
  - Uso: clasifica el tipo de recurso.

- `Recurso`
  - Atributos: `titulo`, `descripcion`, `url`, `fecha_subida`, `tipo_recurso`.
  - Relaciones: `atractivo_turistico`.
  - Métodos: `__str__()`.

Services:

- `crear_recurso`.
- `listar_recursos`.
- `importar_desde_excel(file_obj)`.
- `validar_estructura_archivo`.

Serializers:

- `RecursoSerializer`.

Views / Endpoints:

- `GET/POST /api/inventario/recursos/` — Lista y sube recursos multimedia (imágenes, vídeos, documentos).
- `GET/PUT/PATCH/DELETE /api/inventario/recursos/{id}/` — Operaciones sobre un recurso específico.
- `POST /api/inventario/recursos/importar/` — Importa recursos desde un archivo CSV/XLSX (multipart/form-data).

## 11. Módulo `investigacion`

Archivos: [models.py](Turismo/apps/investigacion/models.py) • [services.py](Turismo/apps/investigacion/services.py) • [serializers.py](Turismo/apps/investigacion/serializers.py) • [views.py](Turismo/apps/investigacion/views.py) • [urls.py](Turismo/apps/investigacion/urls.py)

Modelos principales:

- `TipoEvidencia` (TextChoices)
  - Valores: `PRODUCTO`, `RESULTADO`, `APRENDIZAJE`.

- `ProyectoInvestigacion`
  - Atributos: `titulo`, `descripcion`, `fecha_inicio`, `fecha_fin`, `objetivo`, `sector`.
  - Relaciones: `actores`, `evidencias`, `planes_accion`, `impactos`.
  - Métodos: `clean()`, `__str__()`.

- `Actor`
  - Atributos: `proyecto`, `organizacion`.
  - Relaciones: `proyecto`.
  - Métodos: `__str__()`.

- `Evidencia`
  - Atributos: `proyecto`, `titulo`, `descripcion`, `fecha_registro`, `tipo_evidencia`, `recomendacion`.
  - Relaciones: `proyecto`.
  - Métodos: `__str__()`.

- `PlanAccion`
  - Atributos: `proyecto`, `nombre`, `descripcion`, `fecha_inicio`, `fecha_fin`.
  - Relaciones: `proyecto`.
  - Métodos: `clean()`, `__str__()`.

- `Impacto`
  - Atributos: `proyecto`, `descripcion`, `nivel_impacto`, `fecha_evaluacion`.
  - Relaciones: `proyecto`.
  - Métodos: `clean()`, `__str__()`.

Services:

- helpers de creación, actualización y listado.
- acciones relacionadas: `agregar_actor`, `agregar_evidencia`, `agregar_plan_accion`, `agregar_impacto`.

Serializers:

- `ProyectoInvestigacionSerializer`
- `ActorSerializer`.
- `EvidenciaSerializer`.
- `PlanAccionSerializer`.
- `ImpactoSerializer`.

Views / Endpoints:

- `GET/POST /api/investigacion/proyectos/` — Lista y crea proyectos de investigación.
- `GET/PUT/PATCH/DELETE /api/investigacion/proyectos/{id}/` — Gestión de un proyecto.
- `POST /api/investigacion/proyectos/{id}/actores/` — Agrega un actor al proyecto.
- `POST /api/investigacion/proyectos/{id}/evidencias/` — Agrega evidencia al proyecto.
- `POST /api/investigacion/proyectos/{id}/planes-accion/` — Agrega un plan de acción al proyecto.
- `POST /api/investigacion/proyectos/{id}/impactos/` — Agrega un impacto al proyecto.
- `GET/POST /api/investigacion/actores/` — Lista y crea actores.
- `GET/PUT/PATCH/DELETE /api/investigacion/actores/{id}/` — Gestión de un actor.
- `GET/POST /api/investigacion/evidencias/` — Lista y crea evidencias.
- `GET/PUT/PATCH/DELETE /api/investigacion/evidencias/{id}/` — Gestión de una evidencia.
- `GET/POST /api/investigacion/planes-accion/` — Lista y crea planes de acción.
- `GET/PUT/PATCH/DELETE /api/investigacion/planes-accion/{id}/` — Gestión de un plan de acción.
- `GET/POST /api/investigacion/impactos/` — Lista y crea impactos.
- `GET/PUT/PATCH/DELETE /api/investigacion/impactos/{id}/` — Gestión de un impacto.


