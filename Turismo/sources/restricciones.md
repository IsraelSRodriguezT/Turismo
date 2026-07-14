# Restricciones

- Debe usar arquitectura modular
- Cada módulo debe ser una app Django independiente
- Debe seguir Clean Architecture
- Debe usar serializers DRF
- Debe usar ViewSets
- Debe documentarse con OpenAPI
- No mostrar ni registrar tokens, credenciales, stack traces ni datos sensibles en la UI, consola, logs o documentación.
- Validar entradas y permisos en los límites de la API.
- Manejar errores de forma controlada, sin ocultarlos ni exponer información sensible.

# Convenciones

- snake_case
- servicios en cada app
- lógica separada de views