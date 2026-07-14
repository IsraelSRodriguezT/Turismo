# 📚 Índice de Documentación - PIT

Este archivo es tu guía rápida para navegar toda la documentación.

## 🎯 Por Tipo de Usuario

### 👤 Soy Turista
¿Quieres explorar atractivos turísticos? Lee:
- **[INICIO_RAPIDO.qmd](INICIO_RAPIDO.qmd)** - Comienza aquí
- **[_manual_usuario.qmd](_manual_usuario.qmd)** → Sección "Vista para Turistas"
- **[_glosario.qmd](_glosario.qmd)** - Entiende los términos

### 👨‍💼 Soy Gestor Turístico
¿Necesitas crear y editar atractivos? Lee:
- **[INICIO_RAPIDO.qmd](INICIO_RAPIDO.qmd)** - Configuración inicial
- **[_manual_usuario.qmd](_manual_usuario.qmd)** → Sección "Vista para Gestores Turísticos"
- **[_instalacion.qmd](_instalacion.qmd)** - Instalar aplicación

### 🗺️ Soy Gestor Territorial
¿Gestiona datos geográficos? Lee:
- **[_manual_usuario.qmd](_manual_usuario.qmd)** → Sección "Vista para Gestores Territoriales"
- **[_arquitectura.qmd](_arquitectura.qmd)** → Sección "Geolocalización"

### 🔬 Soy Investigador
¿Publicas proyectos de investigación? Lee:
- **[_manual_usuario.qmd](_manual_usuario.qmd)** → Sección "Vista para Investigadores"

### ⚙️ Soy Administrador
¿Gestiona todo el sistema? Lee:
- **[_instalacion.qmd](_instalacion.qmd)** - Instalación completa
- **[_manual_usuario.qmd](_manual_usuario.qmd)** → Sección "Vista para Administradores"
- **[_api.qmd](_api.qmd)** - Todos los endpoints disponibles
- **[_arquitectura.qmd](_arquitectura.qmd)** - Cómo funciona el sistema

### 💻 Soy Desarrollador
¿Necesitas entender el código? Lee:
- **[_arquitectura.qmd](_arquitectura.qmd)** - Visión general
- **[_guia_desarrollador.qmd](_guia_desarrollador.qmd)** - Guía técnica completa
- **[_api.qmd](_api.qmd)** - Endpoints y ejemplos
- **[_instalacion.qmd](_instalacion.qmd)** - Setup del desarrollo

---

## 🗂️ Por Tema

### 🚀 Comenzar
1. [INICIO_RAPIDO.qmd](INICIO_RAPIDO.qmd) - 5 pasos para empezar
2. [_instalacion.qmd](_instalacion.qmd) - Instalación detallada
3. [README.md](README.md) - Información general

### 🏗️ Arquitectura y Diseño
1. [_arquitectura.qmd](_arquitectura.qmd) - Componentes del sistema
   - Visión general
   - Stack tecnológico
   - Flujo de datos
   - Patrones de diseño
   - Integraciones externas
   - Seguridad

### 📡 API y Integración
1. [_api.qmd](_api.qmd) - Documentación completa de API
   - Autenticación JWT
   - Estructura de respuestas
   - Códigos HTTP
   - Endpoints principales
   - Paginación y filtrado
   - Ejemplos en JavaScript y cURL

### 👥 Manual de Usuario
1. [_manual_usuario.qmd](_manual_usuario.qmd) - Guía por rol
   - Vista para Turistas
   - Vista para Gestores Turísticos
   - Vista para Gestores Territoriales
   - Vista para Investigadores
   - Vista para Administradores
   - Funcionalidades comunes
   - Troubleshooting
   - Consejos de uso

### 💡 Desarrollo Técnico
1. [_guia_desarrollador.qmd](_guia_desarrollador.qmd) - Para desarrolladores
   - Stack completo
   - Estructura de código
   - Conceptos clave (Models, Serializers, Views, Services)
   - Autenticación y autorización
   - Estructura Frontend React
   - Testing
   - Workflow de desarrollo
   - Debugging
   - Performance
   - Deployment

### 📖 Referencia
1. [_glosario.qmd](_glosario.qmd) - Términos técnicos
   - Definiciones alfabéticas
   - Acrónimos comunes

---

## 🔗 Referencias Cruzadas

### Autenticación
- ¿Cómo logarse? → [Manual Usuario](file:////_manual_usuario.qmd#iniciar-sesión) 
- ¿Cómo funciona JWT? → [Guía Desarrollador](_guia_desarrollador.qmd#jwt-json-web-tokens)
- ¿Endpoint de login? → [API](_api.qmd#post-apiusuarioslogin)

### Atractivos Turísticos
- ¿Cómo crear atractivo? → [Manual Usuario](_manual_usuario.qmd#registrar-nuevo-atractivo)
- ¿Endpoints disponibles? → [API](_api.qmd#1-atractivos-turísticos)
- ¿Modelo de datos? → [Arquitectura](_arquitectura.qmd#b-atractivos-appsintractivosapps)

### Rutas
- ¿Cómo crear ruta? → [Manual Usuario](_manual_usuario.qmd#crear-ruta-turística)
- ¿Endpoints de rutas? → [API](_api.qmd#3-rutas-turísticas)

### API REST
- ¿Qué es REST? → [Glosario](_glosario.qmd#r)
- ¿Cómo autenticar requests? → [API](_api.qmd#autenticación)
- ¿Estructura de respuestas? → [API](_api.qmd#estructura-de-respuesta)

### Desarrollo
- ¿Crear nueva funcionalidad? → [Guía Desarrollador](_guia_desarrollador.qmd#1-crear-nueva-funcionalidad)
- ¿Estructura de componentes? → [Guía Desarrollador](_guia_desarrollador.qmd#componentes)
- ¿Cómo hacer deploy? → [Guía Desarrollador](_guia_desarrollador.qmd#deployment)

---

## 📊 Estadísticas de Documentación

- **Total de secciones**: 7 documentos principales
- **Palabras**: ~35,000+
- **Código de ejemplo**: 50+ snippets
- **Diagramas**: Múltiples diagramas de arquitectura
- **Tablas de referencia**: 30+ tablas

---

## ⚡ Acciones Rápidas

### Renderizar Documentación a HTML
```bash
# Windows
render.bat

# macOS/Linux
bash render.sh
```

### Ver Documentación en Vivo
```bash
quarto preview index.qmd
```

### Abrir Archivo Específico
- Abre cualquier archivo `.qmd` en tu editor de código
- El formato es Markdown estándar

---

## 📝 Cómo Usar Esta Documentación

### En Navegador (HTML)
1. Renderiza con: `quarto render index.qmd --to html`
2. Abre `index.html` en tu navegador
3. Usa tabla de contenidos para navegar
4. Usa Ctrl+F para buscar término

### En Editor de Código
1. Abre archivo `.qmd` en VS Code, Sublime, etc.
2. Lee como Markdown normal
3. Atajos: Ctrl+F para buscar en archivo

### En Formato PDF
1. Renderiza con: `quarto render index.qmd --to pdf`
2. Abre `index.pdf` con tu lector PDF favorito
3. Imprime si es necesario

---

## 🎓 Ruta de Aprendizaje Sugerida

### Para Nuevos Usuarios
1. ✅ [INICIO_RAPIDO.qmd](INICIO_RAPIDO.qmd) (5 min)
2. ✅ [README.md](README.md) (10 min)
3. ✅ [_arquitectura.qmd](_arquitectura.qmd) - Sección "Visión General" (15 min)
4. ✅ [_manual_usuario.qmd](_manual_usuario.qmd) - Tu sección de rol (20 min)

### Para Desarrolladores
1. ✅ [INICIO_RAPIDO.qmd](INICIO_RAPIDO.qmd) (5 min)
2. ✅ [_instalacion.qmd](_instalacion.qmd) (15 min)
3. ✅ [_arquitectura.qmd](_arquitectura.qmd) (30 min)
4. ✅ [_guia_desarrollador.qmd](_guia_desarrollador.qmd) (60 min)
5. ✅ [_api.qmd](_api.qmd) (30 min)

### Para Administradores
1. ✅ [INICIO_RAPIDO.qmd](INICIO_RAPIDO.qmd) (5 min)
2. ✅ [_instalacion.qmd](_instalacion.qmd) (20 min)
3. ✅ [_manual_usuario.qmd](_manual_usuario.qmd) - Sección Admin (30 min)
4. ✅ [_arquitectura.qmd](_arquitectura.qmd) (20 min)
5. ✅ [_api.qmd](_api.qmd) - Para entender operaciones (20 min)

---

## 🔍 Buscar Términos

### Conceptos Principales
- **API**: [_api.qmd](_api.qmd), [_glosario.qmd](_glosario.qmd#a)
- **Autenticación**: [_api.qmd](_api.qmd#autenticación), [_guia_desarrollador.qmd](_guia_desarrollador.qmd#autenticación-y-autorización)
- **Atractivos**: [_manual_usuario.qmd](_manual_usuario.qmd#explorar-atractivos), [_api.qmd](_api.qmd#1-atractivos-turísticos)
- **Rutas**: [_manual_usuario.qmd](_manual_usuario.qmd#explorar-rutas-turísticas), [_api.qmd](_api.qmd#3-rutas-turísticas)
- **Usuarios**: [_manual_usuario.qmd](_manual_usuario.qmd#gestionar-usuarios), [_arquitectura.qmd](_arquitectura.qmd#a-usuarios-appsusuariosapps)

---

## 📞 Contacto y Soporte

Si necesitas ayuda:
1. Busca en este índice
2. Lee la sección relevante
3. Consulta el glosario para términos
4. Revisa troubleshooting en manual

---

**Última actualización**: 22 de Junio de 2026  
**Versión de Documentación**: 1.0.0  
**Versión de Aplicación**: 1.0.0
