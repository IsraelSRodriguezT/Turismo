# Diagrama de clases

## Modulo de Usuarios

### Persona (Clase Padre)
- `nombre`: string
- `apellido`: string
- `correo`: string
- `telefono`: string

### Usuario (Persona)
- `nickname`: string
- `clave`: string

### Perfil
- `fechaRegistro`: date
- `/cantidadVisitas`: int
- `/puntuacion`: float

### Rol (Enumeración)
- `ADMINISTRADOR`
- `GESTOR_TERRITORIAL`
- `GESTOR_TURISTICO`
- `INVESTIGADOR`
- `TURISTA`

### Valoracion
- `puntuacion`: int
- `fechaRegistro`: date
- `comentario`: string
- `atractivoTuristico`: AtractivoTuristico

### Favorito
- `fechaGuardado`: date
- `atractivoTuristico`: AtractivoTuristico

### PeriodoVisita
- `fechaInicio`: date
- `fechaFin`: date
- `/duracion`: int

### RegistroModificacion
- `fecha`: date
- `hora`: time
- `descripcion`: string
- `atractivoTuristico`: AtractivoTuristico

### TipoAccion (Enumeración)
- `CREACION`
- `MODIFICACION`
- `ELIMINACION`

## Modulo de Geolocalizacion

### Mapa
- `nombre`: string

### Pais
- `nombre`: string

### Provincia
- `nombre`: string

### Canton
- `nombre`: string

### Parroquia
- `nombre`: string

### Sector
- `nombre`: string

## Modulo de Atractivos 

### AtractivoTuristico
- `nombre`: string
- `descripción`: string

### Clasificacion
- `nombre`: string
- `descripción`: string

### NivelClasificacion (Enumeración)
- `CATEGORIA`
- `TIPO`
- `SUBTIPO`

### NivelAccesibilidad (Enumeración)
- `LIBRE`
- `RESTRINGIDO`
- `PAGADO`

### EstadoConservacion (Enumeración)
- `CONSERVADO`
- `ALTERADO`
- `EN_DETERIORO`
- `DETERIORADO`

### Horario
- `horaInicio`: time
- `horaFin`: time

### TipoHorario (Enumeración)
- `NORMAL`
- `FIN_SEMANA`
- `FERIADO`
- `ESPECIAL`

### Recomendacion
- `descripcion`: string

### Gerente (Persona)
- `institucion`: string
- `esAdministradorPublico`: boolean
- `cargo`: string

### Servicio
- `nombre`: string
- `descripcion`: string
- `estaDisponible`: boolean
- `costo`: float

### Ubicacion
- `latitud`: double
- `longitud`: double
- `altitud`: float

### Direccion
- `callePrincipal`: string
- `calleTransversal`: string
- `numero`: int
- `referencia`: string

### InformacionClimatica
- `clima`: string
- `temperaturaMinima`: int
- `temperaturaMaxima`: int
- `temperaturaActual`: float
- `precipitacionMinima`: int
- `precipitacionMaxima`: int

### DetalleRuta
- `orden`: int

### Ruta
- `nombre`: string
- `descripcion`: string
- `/distancia`: float
- `/duracion`: float
- `nivelDificultad`: int

### EstadoRuta (Enumeración)
- `BUENA`
- `REGULAR`
- `MALA`
- `CERRADA`

## Modulo de Inventario

### Recurso
- `titulo`: string
- `descripción`: string
- `url`: string
- `fechaSubida`: date

### TipoRecurso (Enumeración)
- `IMAGEN`
- `VIDEO`
- `DOCUMENTO`
- `INFOGRAFIA`

## Modulo de Investigacion

### ProyectoInvestigacion
- `titulo`: string
- `descripcion`: string
- `fechaInicio`: date
- `fechaFin`: date
- `objetivo`: string

### Actor (Persona)
- `organizacion`: string

### PlanAccion
- `nombre`: string
- `descripción`: string
- `fechaInicio`: date
- `fechaFin`: date

### Impacto
- `descripción`: string
- `nivelImpacto`: int
- `fechaEvaluacion`: date

### Evidencia
- `titulo`: string
- `descripcion`: string
- `fechaRegistro`: date
- `recomendacion`: string

### TipoEvidencia (Enumeración)
- `PRODUCTO`
- `RESULTADO`
- `APRENDIZAJE`


