# Estilo visual general

El diseño debe ser:

* moderno;
* limpio;
* profesional;
* accesible;
* responsivo;
* consistente;
* escalable;

Debe transmitir:

* confianza;
* orden;
* seguridad;
* eficiencia;
* trazabilidad;
* claridad;
* profesionalismo.

Evitar diseños recargados, exceso de colores, elementos decorativos innecesarios o pantallas con demasiada información del mismo peso visual.

---

## 1. Arquitectura cromática (60-30-10)

Aplicar una arquitectura cromática profesional basada en la regla 60-30-10.

## 1.1 Color dominante / neutro — 60%

Usar colores neutros para:

- fondos generales;
- superficies;
- tarjetas;
- tablas;
- formularios;
- paneles secundarios;
- espacios negativos;
- contenedores.

El 60% debe permitir descanso visual y legibilidad.

## 1.2 Color principal + color secundario — 30%

Este 30% debe dividirse entre el color principal y el color secundario.

Distribución sugerida:

- 20% color principal.
- 10% color secundario.

### Color principal

Color principal del proyecto:

`#2563EB`

Usar para:

- identidad visual;
- navegación activa;
- botones primarios;
- selección activa;
- encabezados principales;
- acciones dominantes;
- elementos institucionales o de marca.

### Color secundario

Color secundario del proyecto:

`#64748B`

Usar para:

- navegación secundaria;
- iconografía secundaria;
- metadatos;
- bordes técnicos;
- filtros;
- paneles informativos;
- gráficos de soporte;
- encabezados secundarios;
- información contextual;
- estados informativos no críticos.

El color secundario debe complementar al color principal, no competir con él.

## 1.3 Color de acento — 10%

Color de acento del proyecto:

`#10B981`

Usar solo para:

- llamadas a la acción especiales;
- foco visual;
- funciones inteligentes;
- acciones destacadas;
- elementos que requieren atención;
- acciones no destructivas de alto valor.

No usar el color de acento en todos los botones.

---


## 2. Colores semánticos

Usar colores semánticos solo para estados del sistema:

- Success: éxito, aprobado, completado, validado. (#16A34A)
- Warning: advertencia, pendiente, requiere revisión. (#F59E0B)
- Danger: error, crítico, restringido, falla. (#DC2626)
- Info: información, ayuda, en revisión. (#0EA5E9)

Todo estado debe incluir:

- color;
- texto;
- icono;
- etiqueta visible.

No usar el color como único medio de información.

Ejemplos:

- “Aprobado” + icono check + color success.
- “Pendiente” + icono reloj + color warning.
- “Restringido” + icono bloqueo + color danger.
- “En revisión” + icono información + color info.

---


## 3. Arquitectura de información

Organizar la navegación de forma clara y predecible.

La interfaz debe incluir, si aplica:

### 3.1 Barra superior

Incluir:

- nombre del sistema;
- logo o nombre de la institución;
- buscador global;
- usuario autenticado;
- rol;
- notificaciones;
- perfil;
- cerrar sesión.

### 3.2 Breadcrumbs

Mostrar la ubicación actual del usuario.

Ejemplo:

`Inicio / [Módulo] / [Pantalla actual]`

### 3.3 Búsqueda

Incluir búsqueda global o búsqueda por módulo cuando el sistema maneje muchos registros.

---

# 3.4 Selectable Cards

Usar Selectable Cards cuando una opción requiera contexto, descripción, icono o comparación visual.

Usarlas para:

* selección de tipo;
* selección de categoría;
* selección de módulo;
* selección de rol con explicación;
* selección de nivel de riesgo;
* selección de opción estratégica;
* selección múltiple con contexto.

No usarlas para:

* fechas;
* nombres;
* correos;
* responsables;
* listas muy extensas;
* opciones simples sin contexto.

Cada Selectable Card debe incluir:

* título;
* descripción breve;
* icono;
* indicador de selección;
* estado focus;
* estado selected;
* estado disabled;
* texto “Seleccionado” cuando aplique.

Reglas:

* no depender solo del color;
* usar borde + icono + texto;
* permitir navegación por teclado;
* usar comportamiento de RadioGroup si es selección única;
* usar comportamiento de CheckboxGroup si es selección múltiple;
* no colocar botones dentro de una card completamente interactiva.

---

# 4. Componentes UI esperados

Crear una guía de componentes con diseño atómico.

## 4.1 Átomos

- botones;
- inputs;
- selects;
- checkboxes;
- radios;
- switches;
- badges;
- iconos;
- enlaces;
- tooltips;
- etiquetas;
- chips.

## 4.2 Moléculas

- campo de búsqueda;
- filtro combinado;
- card de indicador;
- mensaje inline;
- selector de fecha;
- grupo de acciones;
- badge con icono;
- bloque de ayuda;
- control de paginación.

## 4.3 Organismos

- header;
- menú lateral;
- tabla de datos;
- formulario por pasos;
- panel de alertas;
- dashboard de indicadores;
- repositorio documental;
- timeline de auditoría;
- matriz de riesgos;
- panel de filtros.

## 4.4 Plantillas

- layout de dashboard;
- layout de listado;
- layout de formulario;
- layout de detalle;
- layout de reporte;
- layout de administración;
- layout de auditoría.

---

# 5. Reglas para botones

Definir estos tipos:

- Primario: acción principal.
- Secundario: volver, cancelar, limpiar filtros.
- Acento: acción especial o inteligente.
- Danger: eliminar, restringir, revocar.
- Ghost: acciones de baja prioridad.

Usar textos específicos:

- “Guardar borrador”
- “Guardar cambios”
- “Aplicar filtros”
- “Enviar a revisión”
- “Registrar AtractivoTuristico”
- “Generar análisis”
- “Exportar PDF”

Evitar botones genéricos como “Aplicar” o “Guardar” sin contexto.

---

# 6. Reglas para badges

Normalizar badges:

- Aprobado / Completado: success + icono check.
- En revisión / Informativo: info + icono reloj o información.
- Observado / Pendiente: warning + icono alerta.
- Restringido / Crítico: danger + icono bloqueo o alerta.
- Borrador: neutral + icono documento.
- Cerrado: neutral oscuro + icono candado.

Todos los badges deben tener texto visible.

---

# 7. Reglas para tablas

Las tablas deben ser funcionales para gestión real.

Incluir:

- modo compacto;
- modo cómodo si aplica;
- filas no excesivamente altas;
- filtros claros;
- búsqueda persistente;
- ordenamiento;
- paginación;
- columnas configurables;
- badges consistentes;
- tooltips en iconos;
- acciones secundarias en menú de tres puntos.

En escritorio, usar tabla.

En móvil, transformar cada fila en card.

---

# 8. Reglas para formularios

Los formularios deben ser claros, accesibles y progresivos.

Incluir:

- labels visibles;
- campos obligatorios identificados;
- mensajes inline;
- ayuda contextual;
- agrupación lógica;
- secciones o pasos;
- resumen antes de enviar;
- confirmación para acciones críticas;
- opción de guardar borrador si aplica.

No mostrar formularios largos sin división visual.

---

# 9. Estados del sistema

Cada pantalla debe considerar:

- estado inicial;
- estado cargando;
- skeleton loading;
- estado vacío;
- estado con datos;
- estado con error;
- estado sin permisos;
- estado de éxito;
- estado de advertencia;
- estado de confirmación;
- estado de sesión expirada;
- estado de solo lectura;
- estado con cambios sin guardar.

Ejemplos:

- “No existen registros disponibles.”
- “No se encontraron resultados con los filtros aplicados.”
- “No tiene permisos para acceder a esta sección.”
- “Los cambios se guardaron correctamente.”
- “Existen campos obligatorios pendientes.”
- “La sesión ha expirado. Inicie sesión nuevamente.”

---

# 10. Notificaciones

Usar:

## 10.1 Toast

Para confirmaciones breves:

- “Registro guardado correctamente.”
- “Cambios aplicados correctamente.”

## 10.2 Banner

Para alertas contextuales:

- “Existen elementos pendientes de revisión.”
- “El documento está próximo a vencer.”

## Modal

Solo para decisiones críticas:

* eliminar;
* restringir;
* revocar;
* cerrar sesión;
* confirmar envío definitivo.

## Inline

Para errores de formulario:

* campo obligatorio;
* formato inválido;
* selección requerida.

Toda notificación debe incluir:

* icono;
* texto claro;
* acción si corresponde;
* buen contraste;
* foco accesible si contiene botones.

---

# 17. Accesibilidad

Aplicar criterios WCAG.

Requisitos:

* contraste mínimo 4.5:1 para texto normal;
* contraste mínimo 3:1 para componentes UI;
* no usar color como único medio de información;
* navegación por teclado;
* foco visible;
* labels visibles;
* errores inline persistentes;
* botones con nombres claros;
* cards seleccionables accesibles;
* tablas con encabezados claros;
* mensajes compatibles con tecnologías asistivas.

Focus recomendado:

* `2px solid #10B981`
* offset: `2px`

Tamaños mínimos:

* cuerpo: 14–16px;
* labels: 12–14px;
* badges: mínimo 12px;
* tabla: 13–14px;
* mobile: evitar textos inferiores a 13px.

---

# 18. Responsive

Diseñar para escritorio:

* menú lateral fijo;
* dashboard amplio;
* tablas completas;
* filtros visibles;
* formularios con ancho máximo;
* paneles de detalle.

---

# 20. Tokens de diseño

Definir tokens visuales.

## Colores

* sys.color.background
* sys.color.surface
* sys.color.surface-muted
* sys.color.primary
* sys.color.primary-hover
* sys.color.primary-active
* sys.color.secondary
* sys.color.secondary-hover
* sys.color.secondary-active
* sys.color.accent
* sys.color.accent-hover
* sys.color.accent-active
* sys.color.success
* sys.color.warning
* sys.color.danger
* sys.color.info
* sys.color.border
* sys.color.focus
* sys.color.disabled
* sys.color.on-primary
* sys.color.on-secondary
* sys.color.on-surface

## Espaciado

* spacing-1: 4px
* spacing-2: 8px
* spacing-3: 12px
* spacing-4: 16px
* spacing-6: 24px
* spacing-8: 32px
* spacing-10: 40px

## Radius

* radius-sm: 6px
* radius-md: 10px
* radius-lg: 14px
* radius-xl: 20px

## Tipografía

* h1: 28–32px
* h2: 22–24px
* h3: 18–20px
* body: 14–16px
* label: 12–14px
* badge: mínimo 12px

---

# 21. Relación con backend o API

Si el sistema consume una API, el diseño debe considerar:

* estados de carga;
* errores de servidor;
* validaciones del backend;
* paginación;
* filtros;
* búsqueda;
* permisos;
* sesión expirada;
* mensajes de éxito;
* mensajes de error.

Si existe contrato universal de respuesta, considerar:

* success;
* message;
* data;
* errors;
* meta;
* pagination;
* request_id;
* timestamp.

Mostrar `request_id` o datos técnicos solo en pantallas de auditoría, soporte o detalle de error.

---

# 23. Resultado esperado

Genera un prototipo visual completo de **PIT (Plataforma Interactiva de Turismo)** con:

* pantallas principales;
* navegación clara;
* UI moderna;
* UX accesible;
* arquitectura cromática 60-30-10;
* color principal, secundario y acento bien diferenciados;
* componentes reutilizables;
* formularios claros;
* tablas funcionales;
* Selectable Cards donde aporten valor;
* estados de carga, vacío, error y sin permisos;
* diseño responsive;
* guía de componentes;
* preparación para implementación frontend y documentación SDD/Spec Kit.

El prototipo debe sentirse como un sistema real, profesional, accesible, moderno, escalable e implementable.
