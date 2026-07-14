---
title: "🗺️ Mapa de Navegación"
subtitle: "Encuentra exactamente lo que buscas"
---

# 🗺️ Mapa de Navegación - Documentación PIT

Este documento te ayuda a encontrar exactamente lo que buscas en la documentación.

## 🎯 Encuentra lo que buscas

### 🔍 Búsqueda por Palabra Clave

| Busco... | Archivo | Sección |
|----------|---------|---------|
| Cómo empezar | [INICIO_RAPIDO.qmd](INICIO_RAPIDO.qmd) | Todo el archivo |
| Instalar aplicación | [_instalacion.qmd](_instalacion.qmd) | Todo el archivo |
| Estructura de carpetas | [_arquitectura.qmd](_arquitectura.qmd) | Componentes Principales |
| Crear atractivo | [_manual_usuario.qmd](_manual_usuario.qmd) | Registrar Nuevo Atractivo |
| Crear ruta | [_manual_usuario.qmd](_manual_usuario.qmd) | Crear Ruta Turística |
| Gestionar usuarios | [_manual_usuario.qmd](_manual_usuario.qmd) | Gestionar Usuarios |
| Endpoints de API | [_api.qmd](_api.qmd) | Endpoints Principales |
| Autenticación | [_api.qmd](_api.qmd) | Sección Autenticación |
| Modelos de datos | [_guia_desarrollador.qmd](_guia_desarrollador.qmd) | Models (Modelos de Datos) |
| Cómo desarrollar | [_guia_desarrollador.qmd](_guia_desarrollador.qmd) | Workflow de Desarrollo |
| Términos técnicos | [_glosario.qmd](_glosario.qmd) | Todo el archivo |
| Hacer deploy | [_guia_desarrollador.qmd](_guia_desarrollador.qmd) | Deployment |
| Token JWT | [_api.qmd](_api.qmd) | JWT (JSON Web Tokens) |
| Permisos de usuario | [_guia_desarrollador.qmd](_guia_desarrollador.qmd) | Permisos |

---

## 🎓 Por Nivel de Experiencia

### Soy Completamente Nuevo

```
Recomendación: 45 minutos
┌──────────────────────────────┐
│ 1. ESTRUCTURA.txt (2 min)   │ Visión general de la carpeta
├──────────────────────────────┤
│ 2. README.md (8 min)         │ Qué es PIT y cómo usarla
├──────────────────────────────┤
│ 3. INICIO_RAPIDO.qmd (15 min)│ Instalar y ejecutar
├──────────────────────────────┤
│ 4. _manual_usuario.qmd       │ Tu rol específico
│    (20 min)                  │
└──────────────────────────────┘
```

### Tengo Experiencia Técnica

```
Recomendación: 90 minutos
┌──────────────────────────────┐
│ 1. README.md (5 min)         │ Contexto general
├──────────────────────────────┤
│ 2. _instalacion.qmd (20 min) │ Preparar entorno
├──────────────────────────────┤
│ 3. _arquitectura.qmd (30 min)│ Diseño del sistema
├──────────────────────────────┤
│ 4. _guia_desarrollador.qmd   │ Conceptos técnicos
│    (25 min)                  │
├──────────────────────────────┤
│ 5. _api.qmd (10 min)         │ Endpoints y ejemplos
└──────────────────────────────┘
```

### Soy Desarrollador Experimentado

```
Recomendación: 60 minutos
┌──────────────────────────────┐
│ 1. _instalacion.qmd (15 min) │ Setup
├──────────────────────────────┤
│ 2. _arquitectura.qmd (20 min)│ Diseño
├──────────────────────────────┤
│ 3. _guia_desarrollador.qmd   │ Implementación
│    (20 min) - Secciones clave│
├──────────────────────────────┤
│ 4. _api.qmd (5 min)          │ Referencia rápida
└──────────────────────────────┘
```

---

## 📚 Por Tipo de Tarea

### ⚙️ Instalar y Ejecutar

**Tarea**: Tener la aplicación corriendo

```
1. Lee: INICIO_RAPIDO.qmd
2. Sigue: Los 5 pasos
3. Verifica: Al final de INICIO_RAPIDO.qmd
4. Si hay problemas: Mira Troubleshooting en _instalacion.qmd
```

### 👤 Crear Nueva Cuenta de Usuario

**Tarea**: Registrar un usuario en el sistema

```
1. Lee: _manual_usuario.qmd → "Gestionar Usuarios"
2. Ve a: Crear Usuario
3. Sigue: Los pasos indicados
4. Confirmación: Email se enviará al usuario
```

### 📍 Registrar Atractivo Turístico

**Tarea**: Agregar un nuevo atractivo al mapa

```
1. Lee: _manual_usuario.qmd → "Registrar Nuevo Atractivo"
2. Sigue: Los 10 pasos del registro
3. Nota: Puedes guardar como borrador y editar después
4. Publicar: Cuando esté listo
```

### 🛣️ Crear Ruta Turística

**Tarea**: Crear un recorrido que incluya varios atractivos

```
1. Lee: _manual_usuario.qmd → "Crear Ruta Turística"
2. Sigue: Los 5 pasos
3. Tip: Asegúrate de tener atractivos creados primero
4. Resultado: Ruta visible en mapa con orden de visita
```

### 📞 Consumir API desde mi App

**Tarea**: Conectar mi aplicación a PIT via API REST

```
1. Lee: _api.qmd → "Introducción a la API"
2. Ve a: "Autenticación" para obtener token
3. Consulta: "Endpoints Principales" para ver operaciones
4. Mira: "Ejemplos de Integración" (JavaScript/cURL)
5. Implementa: En tu aplicación
```

### 💻 Extender Funcionalidad

**Tarea**: Agregar nueva funcionalidad al código

```
1. Lee: _guia_desarrollador.qmd → "Workflow de Desarrollo"
2. Sigue: Los pasos para crear nueva funcionalidad
3. Lee: Sección relevante (_arquitectura.qmd o _guia_desarrollador.qmd)
4. Implementa: Tu cambio
5. Testa: Ejecuta tests
```

### 🐛 Debuggear un Problema

**Tarea**: Encontrar y corregir un error

```
1. Ve a: _manual_usuario.qmd → "Resolución de Problemas Comunes"
2. Busca: Tu problema específico
3. Si no está ahí: Ve a _guia_desarrollador.qmd → "Debugging"
4. Usa: Las técnicas descritas
5. Si persiste: Revisa logs en terminal
```

### 📊 Entender la Arquitectura

**Tarea**: Aprender cómo funciona todo

```
1. Lee: _arquitectura.qmd → "Visión General"
2. Lee: "Componentes Principales"
3. Lee: "Flujo de Datos"
4. Lee: Secciones específicas según interés
5. Complementa: Con _guia_desarrollador.qmd
```

---

## 🧭 Navegación por Carpeta

### Si Busco en Carpeta `/documentation`

```
documentation/
├── 📄 ESTRUCTURA.txt          ← Estás aquí si lees este archivo
├── 📖 README.md               ← Información general
├── ⚡ INICIO_RAPIDO.qmd       ← Para empezar
├── 📑 INDICE.md               ← Listado completo
├── 🗺️ MAPA.md                ← Este archivo
│
├── 📘 Documentación Técnica
│   ├── index.qmd              ← Documento principal (incluye todo)
│   ├── _arquitectura.qmd      ← Cómo está hecho
│   ├── _guia_desarrollador.qmd ← Para desarrolladores
│   └── _glosario.qmd          ← Definiciones
│
├── 📗 Documentación de Usuario
│   ├── _manual_usuario.qmd    ← Cómo usar por rol
│   └── _instalacion.qmd       ← Cómo instalar
│
├── 📕 Documentación de API
│   └── _api.qmd               ← Endpoints y ejemplos
│
├── ⚙️ Configuración
│   ├── _quarto.yml            ← Config de Quarto
│   └── styles.css             ← Estilos web
│
└── 🔧 Scripts
    ├── render.bat             ← Renderizar en Windows
    └── render.sh              ← Renderizar en macOS/Linux
```

---

## 🎯 Preguntas Frecuentes - Encuentra la Respuesta

### P: ¿Dónde empiezo?
**R**: [INICIO_RAPIDO.qmd](INICIO_RAPIDO.qmd)

### P: ¿Cómo instalo?
**R**: [_instalacion.qmd](_instalacion.qmd)

### P: ¿Qué es cada rol?
**R**: [_manual_usuario.qmd](_manual_usuario.qmd) → Tipos de Usuarios

### P: ¿Cómo creo un atractivo?
**R**: [_manual_usuario.qmd](_manual_usuario.qmd) → Registrar Nuevo Atractivo

### P: ¿Cuál es la contraseña?
**R**: [_instalacion.qmd](_instalacion.qmd) → Paso 6 (Crear Superusuario)

### P: ¿Cómo me conecto a la API?
**R**: [_api.qmd](_api.qmd) → Autenticación

### P: ¿Cómo desarrollo una nueva feature?
**R**: [_guia_desarrollador.qmd](_guia_desarrollador.qmd) → Workflow de Desarrollo

### P: ¿Qué significa este término técnico?
**R**: [_glosario.qmd](_glosario.qmd)

### P: ¿Dónde están los endpoints?
**R**: [_api.qmd](_api.qmd) → Endpoints Principales

### P: ¿Hay algún problema?
**R**: [_manual_usuario.qmd](_manual_usuario.qmd) → Resolución de Problemas

---

## 📱 Acceso Rápido por Dispositivo

### Desde Computadora
1. Abre navegador
2. Ve a: `file:///[ruta]/documentation/index.html`
3. O: `quarto preview index.qmd`

### Desde Tablet/Móvil
1. Genera PDF: `quarto render index.qmd --to pdf`
2. Abre en lector PDF
3. O: Abre archivos `.md` en editor de texto

### Offline
1. Descarga carpeta `documentation/`
2. Genera HTML: `quarto render index.qmd --to html`
3. Abre `index.html` sin internet

---

## 🔄 Flujo Recomendado de Lectura

```
NUEVA PERSONA EN EL PROYECTO
        ↓
    ¿Cuál es tu rol?
    ↙        ↓          ↘
Usuario   Técnico    Desarrollador
  ↓          ↓            ↓
[Manual]  [Arch +     [Arch +
 Usuario]  Manual]     Dev + API]
  ↓          ↓            ↓
[Consulta  [Consulta   [Consulta
 API si     Desarrollo  Testing +
 es nec]   si necesita] Deployment]
  ↓          ↓            ↓
LISTO      LISTO         LISTO
```

---

## ✨ Características por Archivo

| Archivo | Caracteres | Tema | Ideal Para |
|---------|-----------|------|-----------|
| ESTRUCTURA.txt | ASCII | Mapa visual | Obtener visión general |
| README.md | Markdown | Intro | Entender carpeta |
| INICIO_RAPIDO.qmd | Quarto | Setup | Comenzar rápido |
| INDICE.md | Markdown | Navegación | Buscar secciones |
| index.qmd | Quarto | Todos | Lectura completa |
| _arquitectura.qmd | Quarto | Diseño | Entender sistema |
| _instalacion.qmd | Quarto | Setup | Instalar |
| _api.qmd | Quarto | API | Integración |
| _manual_usuario.qmd | Quarto | Usuario | Usar plataforma |
| _guia_desarrollador.qmd | Quarto | Desarrollo | Programar |
| _glosario.qmd | Quarto | Referencia | Buscar términos |

---

## 🎓 Rutas de Aprendizaje Recomendadas

### Ruta: Turista
⏱️ Tiempo: 15 minutos
```
INICIO_RAPIDO.qmd (5 min)
    ↓
_manual_usuario.qmd → Vista Turista (10 min)
    ↓
¡Listo para explorar!
```

### Ruta: Administrador
⏱️ Tiempo: 45 minutos
```
INICIO_RAPIDO.qmd (5 min)
    ↓
_instalacion.qmd (15 min)
    ↓
_manual_usuario.qmd → Vista Administrador (20 min)
    ↓
_api.qmd si necesita (5 min)
    ↓
¡Administrar el sistema!
```

### Ruta: Desarrollador
⏱️ Tiempo: 120 minutos
```
README.md (5 min)
    ↓
_instalacion.qmd (15 min)
    ↓
_arquitectura.qmd (30 min)
    ↓
_guia_desarrollador.qmd (50 min)
    ↓
_api.qmd (15 min)
    ↓
_glosario.qmd (cuando lo necesites)
    ↓
¡Desarrollar funcionalidades!
```

---

## 💾 Descargar Documentación

### Formato Web (HTML)
```bash
quarto render index.qmd --to html
# Copia el archivo index.html
```

### Formato PDF
```bash
quarto render index.qmd --to pdf
# Copia el archivo index.pdf
```

### Formato Markdown
```bash
# Todos los .qmd son Markdown
# Cópia la carpeta documentation/
```

---

## 🔗 Enlaces Rápidos

**Para Turistas**: [_manual_usuario.qmd](_manual_usuario.qmd#vista-para-turistas)  
**Para Gestores**: [_manual_usuario.qmd](_manual_usuario.qmd#vista-para-gestores-turísticos)  
**Para Admins**: [_manual_usuario.qmd](_manual_usuario.qmd#vista-para-administradores)  
**Para Desarrolladores**: [_guia_desarrollador.qmd](_guia_desarrollador.qmd)  
**Para Integrar API**: [_api.qmd](_api.qmd)  

---

```
╔═══════════════════════════════════════════════════════════════╗
║ 🎯 Ahora sabes dónde está TODO en la documentación          ║
║ Usa Ctrl+F para buscar términos específicos                 ║
╚═══════════════════════════════════════════════════════════════╝
```
