# Estructura de Respuestas de Endpoints

Todos los endpoints de la API **deben** devolver respuestas envueltas en la siguiente estructura base:

## Respuesta Exitosa (2xx)
```json
{
  "success": true,
  "message": "Operación realizada exitosamente",
  "data": { ... },
  "errors": null,
  "meta": { ... }
}
```

**Campos:**
- **success** (boolean): Indica inmediatamente al cliente si la operación prosperó sin evaluar el código HTTP.
- **message** (string): Mensaje legible para humanos, útil para notificaciones en UI.
- **data** (object/array): El resultado principal (payload) de la operación de negocio. Null en errores.
- **errors** (object): Detalles técnicos o funcionales estructurados. Null en éxito.
- **meta** (object): Metadatos vitales como paginación, trazabilidad, tiempos.

## Respuesta con Error (4xx, 5xx)
```json
{
  "success": false,
  "errors": {
    "code": "VALIDATION_ERROR",
    "details": [
      {
        "field": "email",
        "message": "El correo es obligatorio."
      }
    ]
  },
  "message": "Solicitud no válida",
  "data": null,
  "meta": { ... }
}
```

## Catálogo de Códigos HTTP y Estados de Error

| Código HTTP | Estado | Significado |
|-------------|--------|-------------|
| 200 OK | Éxito | Operación completada correctamente. |
| 201 Created | Éxito | Recurso creado exitosamente. |
| 204 No Content | Éxito | Operación exitosa sin contenido de respuesta. |
| 400 Bad Request | Error | Solicitud mal formada o parámetros inválidos. |
| 401 Unauthorized | Error | Falta autenticación (token inválido o expirado). |
| 403 Forbidden | Error | Sin permisos suficientes (rol insuficiente). |
| 404 Not Found | Error | Recurso inexistente. |
| 409 Conflict | Error | Conflicto de negocio o duplicidad (ej. correo ya registrado). |
| 422 Unprocessable Entity | Error | Error de validación de campos específicos. |
| 500 Internal Server Error | Error | Falla interna del servidor. |

## Ejemplos de Estructura de Error

**Validación de campos** (422 Unprocessable Entity):
```json
{
  "success": false,
  "errors": {
    "code": "VALIDATION_ERROR",
    "details": [
      {
        "field": "email",
        "message": "El correo es obligatorio."
      },
      {
        "field": "password",
        "message": "La contraseña debe tener al menos 8 caracteres."
      }
    ]
  },
  "message": "Error de validación de campos",
  "data": null
}
```

**Recurso duplicado** (409 Conflict):
```json
{
  "success": false,
  "errors": {
    "code": "CONFLICT",
    "details": [
      {
        "field": "email",
        "message": "El correo ya está registrado."
      }
    ]
  },
  "message": "Conflicto de negocio o duplicidad",
  "data": null
}
```

**Error de autenticación** (401 Unauthorized):
```json
{
  "success": false,
  "errors": {
    "code": "UNAUTHORIZED",
    "details": []
  },
  "message": "Token inválido o expirado",
  "data": null
}
```

**Error de permisos** (403 Forbidden):
```json
{
  "success": false,
  "errors": {
    "code": "FORBIDDEN",
    "details": []
  },
  "message": "Sin permisos suficientes",
  "data": null
}
```