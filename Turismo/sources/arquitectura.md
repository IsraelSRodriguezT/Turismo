# Arquitectura — PIT (Plataforma Interactiva de Turismo)

## Resumen
Arquitectura modular basada en **Django + React** con separación clara de responsabilidades entre frontend, backend y servicios externos. Implementa el modelo **C4** para documentación arquitectónica en 4 niveles: Contexto, Contenedores, Componentes y Código.

---

## NIVEL 1: Contexto del Sistema

Define los límites del sistema, actores externos y dependencias de alto nivel.

### Actores (Personas)
- **Usuario General**: Accede a la plataforma desde navegadores/dispositivos móviles
- **Administrador**: Administra la plataforma completa
- **Gestor Territorial**: Gestiona información territorial y administrativa
- **Gestor Turístico**: Gestiona contenido turístico, atractivos y rutas
- **Investigador**: Gestiona y valida contenidos de investigación
- **Turista**: Consulta atractivos, rutas e información turística

### Sistemas Externos
- **INAMI**: Servicio REST de datos climáticos
- **ECU 911**: Servicio REST de estado de vías y seguridad

### Sistema Principal
- **PIT (Plataforma Interactiva de Turismo)**: Caja negra que expone funcionalidad a usuarios y se integra con sistemas externos

### Protocolos
- Todas las comunicaciones con PIT vía HTTPS/JSON

---

## NIVEL 2: Contenedores del Sistema

Define los componentes ejecutables principales y sus responsabilidades.

### 2.1 Frontend (React)
- **Responsabilidad**: Interfaz web interactiva para administradores, gestores, investigadores y turistas
- **Usuarios**: Administrador, Gestor Territorial, Gestor Turístico, Investigador
- **Protocolo**: Consume API Backend vía JSON/HTTPS
- **Stack**: React, Redux (state), React Router (navigation)
- **Características clave**:
  - Mapa interactivo (e.g., Leaflet, Mapbox)
  - Formularios de gestión CRUD
  - Panel administrativo con vistas diferenciadas por rol

### 2.2 App Móvil (React Native)
- **Responsabilidad**: Aplicación móvil nativa para turistas (iOS/Android)
- **Usuarios**: Turista
- **Protocolo**: Consume API Backend vía JSON/HTTPS
- **Stack**: React Native, Redux/Context
- **Características clave**:
  - Consulta de atractivos y rutas
  - Mapas offline
  - Acceso a información turística local

### 2.3 Backend (Django REST Framework)
- **Responsabilidad**: Lógica de negocio, procesamiento de datos, orquestación
- **Protocolo**: Expone API JSON/HTTPS, consuma servicios externos
- **Stack**: Django, Django REST Framework, sqlite
- **Contiene**: Views, Serializers, Services, Models, Auth, Integrations (ver Nivel 3)

### 2.4 Base de Datos (sqlite)
- **Responsabilidad**: Persistencia de datos del sistema
- **Acceso**: Via ORM Django desde Backend

### 2.5 Relaciones entre Contenedores
```
Administrador ──HTTPS──> Frontend
Gestor Territorial ──HTTPS──> Frontend
Gestor Turístico ──HTTPS──> Frontend
Investigador ──HTTPS──> Frontend
Turista ──HTTPS──> Frontend
Turista ──HTTPS──> App Móvil

Frontend ──JSON/HTTPS──> Backend (Views)
App Móvil ──JSON/HTTPS──> Backend (Views)

Backend ──ORM/SQL──> Base de Datos
Backend ──REST──> INAMI (clima)
Backend ──REST──> ECU 911 (vías)
```

---

## NIVEL 3: Componentes del Backend

Descompone el contenedor Backend en responsabilidades específicas.

### 3.1 Views (Capa de Entrada HTTP)
- **Responsabilidad**: Recibir requests HTTP, validar autorización, delegar a services
- **Entrada**: JSON payload desde Frontend/App Móvil
- **Salida**: JSON response al cliente
- **Operaciones**:
  1. Recibe request HTTP (GET, POST, PUT, DELETE)
  2. Valida JWT y permisos vía `Auth`
  3. Deserializa payload vía `Serializers`
  4. Delega lógica a `Services`
  5. Serializa respuesta y retorna al cliente
- **Nota**: NO contiene lógica de negocio

### 3.2 Serializers (Capa de Validación y Transformación)
- **Responsabilidad**: Validar, normalizar y transformar datos entre JSON y objetos Python
- **Entrada**: JSON desde cliente o datos internos
- **Salida**: Objetos Python validados o JSON serializado
- **Operaciones**:
  - Validación de tipos de datos
  - Validación de rangos y restricciones de negocio
  - Transformación bidireccional: JSON ⇄ Models

### 3.3 Services (Capa de Lógica de Negocio)
- **Responsabilidad**: Orquestar reglas de negocio, coordinar modelos e integraciones
- **Dependencias**: Models, Integrations, Auth
- **Operaciones principales**:
  - Gestión de atractivos (CRUD, filtrado, búsqueda)
  - Gestión de rutas (cálculo de distancia, asociación con atractivos)
  - Gestión de usuarios y roles
  - Asociación de contenidos a categorías/cantones
  - Coordinación con servicios externos
- **Ejemplo de flujo**:
  ```
  Service.crear_atractivo(datos)
    → Valida permisos (investigador/gestor)
    → Consulta canton desde Models
    → Valida ubicación geoespacial
    → Crea registro en Models
    → Retorna objeto creado
  ```

### 3.4 Models (Capa de Persistencia)
- **Responsabilidad**: Representar entidades del dominio y persistir en Base de Datos
- **Tecnología**: Django ORM
- **Apps existentes (reutilizar)**:
  1. `usuarios/` — Persona, Usuario, Rol, Perfil, Valoracion, Favorito, PeriodoVisita, RegistroModificacion, TipoAccion
  2. `atractivos/` — AtractivoTuristico, Ubicacion, Direccion, InformacionClimatica, Servicio, Gerente, Recomendacion, TipoHorario, Horario, Clasificacion, NivelClasificacion, NivelAccesibilidad, EstadoConservacion, DetalleRuta, EstadoRuta, Ruta
  3. `geolocalizacion/` — Mapa, Pais, Provincia, Canton, Parroquia, Sector
  4. `inventario/` — Recuso, TipoRecurso
  5. `investigacion/` — ProyectoInvestigación, Actor, PlanAccion, Impacto, TipoEvidencia, Evidencia
- **Relaciones**: Definidas via `ForeignKey`, `OneToOneField`
- **Nota**: No crear nuevas apps fuera de este árbol; toda modelación debe incorporarse en las apps existentes.

### 3.5 Auth (Capa de Autenticación y Autorización)
- **Responsabilidad**: Gestionar JWT, validar tokens, verificar permisos y roles
- **Flujo de autenticación**:
  1. Usuario envía credenciales → Backend genera JWT
  2. Cliente almacena JWT en localStorage/Keychain
  3. Cada request incluye token en header `Authorization: Bearer <token>`
  4. Auth middleware valida token y extrae usuario
  5. Views verifica permisos según rol
- **Roles soportados**:
  - ADMINISTRADOR (acceso total)
  - GESTOR_TERRITORIAL (gestión territorial)
  - GESTOR_TURISTICO (gestión de atractivos/rutas)
  - INVESTIGADOR (validación de contenidos)
  - TURISTA (lectura solamente)

### 3.6 Integrations (Capa de Servicios Externos)
- **Responsabilidad**: Adaptar y consumir APIs de servicios externos
- **Servicios integrados**:
  - **INAMI**: Solicita datos climáticos (temperatura, precipitación) para coordenadas GPS
  - **ECU 911**: Consulta estado de vías y seguridad por segmento
- **Patrón**: Adapter pattern — cada servicio tiene wrapper propio
- **Ejemplo**:
  ```
  Integrations.obtener_clima(latitude, longitude)
    → Consulta cache Redis
    → Si no existe → Llama API INAMI
    → Parsea respuesta
    → Almacena en cache
    → Retorna datos normalizados
  ```

### 3.7 Flujo Completo de una Request (Nivel 3)
```
1. Cliente envía: POST /api/atractivos {nombre, descripción, ubicación}
2. Views intercepta request
3. Views valida JWT → Auth
4. Views deserializa JSON → Serializers
5. Serializers valida datos
6. Views delega → Services.crear_atractivo()
7. Services orquesta:
   - Verifica permisos
   - Consulta canton → Models
   - Integra datos externos si es necesario → Integrations
   - Crea registro en BD → Models
8. Models persiste en sqlite
9. Services retorna objeto creado
10. Views serializa respuesta → Serializers
11. Views retorna JSON 201 al cliente
```

## Integraciones Externas

### INAMI (Servicio de Clima)
- **Endpoint**: REST API
- **Parámetros**: Latitud, longitud
- **Respuesta**: Temperatura, precipitación, humedad, condiciones
- **Frecuencia**: Cache 1 hora (evitar rate limiting)

### ECU 911 (Estado de Vías)
- **Endpoint**: REST API
- **Parámetros**: Segmento de vía, coordenadas
- **Respuesta**: Estado (abierto/cerrado), alertas de seguridad, incidentes
- **Frecuencia**: Actualización cada 30 minutos

---

### Escalabilidad
- Replicas de `web` y `worker` según demanda
- Balanceador de carga (nginx/HAProxy) para distribuir requests
- Cache Redis para datos frecuentes (clima, cantones)
- CDN para assets estáticos (imágenes, mapas)

---