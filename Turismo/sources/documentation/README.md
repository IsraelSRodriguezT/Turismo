# Documentación - PIT (Plataforma Interactiva de Turismo)

Bienvenido a la carpeta de documentación completa de **PIT**. Aquí encontrarás toda la información necesaria sobre la aplicación: arquitectura, instalación, API, manual de usuario y guía para desarrolladores.

## Contenido

### 📚 Documentos Principales

1. **index.qmd** - Documento principal con todas las secciones
   - Introducción y características
   - Arquitectura del sistema
   - Guía de instalación
   - Documentación de API
   - Manual de usuario completo
   - Guía del desarrollador
   - Glosario de términos

2. **_arquitectura.qmd** - Arquitectura técnica detallada
   - Visión general de componentes
   - Estructura de capas
   - Integraciones externas
   - Seguridad

3. **_instalacion.qmd** - Pasos de instalación
   - Requisitos del sistema
   - Instalación Backend (Django)
   - Instalación Frontend (React)
   - Troubleshooting

4. **_api.qmd** - Documentación completa de API
   - Autenticación con JWT
   - Estructura de respuestas
   - Endpoints principales
   - Ejemplos de integración

5. **_manual_usuario.qmd** - Manual para todos los usuarios
   - Guía para Turistas
   - Guía para Gestores Turísticos
   - Guía para Gestores Territoriales
   - Guía para Investigadores
   - Guía para Administradores

6. **_guia_desarrollador.qmd** - Documentación técnica para desarrolladores
   - Stack tecnológico
   - Estructura de código
   - Patrones de diseño
   - Testing
   - Deployment

7. **_glosario.qmd** - Glosario de términos técnicos

## Cómo Ver la Documentación

### Opción 1: Renderizar con Quarto (Recomendado)

**Requisitos**:
- Tener Quarto instalado: https://quarto.org/docs/get-started/

**Pasos**:
```bash
# Ir a la carpeta de documentación
cd Turismo/sources/documentation

# Renderizar a HTML
quarto render index.qmd --to html

# O renderizar a PDF
quarto render index.qmd --to pdf

# O renderizar en vivo (auto-refresca)
quarto preview index.qmd
```

**Archivos generados**:
- `index.html` - Versión web (abre en navegador)
- `index.pdf` - Versión PDF (para imprimir o compartir)

### Opción 2: Ver en Navegador (HTML)

Una vez renderizada, abre `index.html` en tu navegador:
```bash
# Windows
start index.html

# macOS
open index.html

# Linux
xdg-open index.html
```

### Opción 3: Ver como Markdown

Abre los archivos `.qmd` directamente en tu editor de código (VS Code, IDE, etc.). Son archivos de texto con formato Markdown.

## Estructura de Archivos

```
documentation/
├── index.qmd                    # Documento principal
├── _arquitectura.qmd            # Sección de arquitectura
├── _instalacion.qmd             # Sección de instalación
├── _api.qmd                     # Sección de API
├── _manual_usuario.qmd          # Sección de manual
├── _guia_desarrollador.qmd      # Sección de desarrollador
├── _glosario.qmd                # Sección de glosario
├── _quarto.yml                  # Configuración de Quarto
├── styles.css                   # Estilos CSS personalizados
└── README.md                    # Este archivo
```

## Información Clave

### Stack de la Aplicación

**Backend**:
- Django 6.0.4
- Django REST Framework
- SQLite (desarrollo) / PostgreSQL (producción)
- JWT para autenticación

**Frontend**:
- React 18.3.1
- React Router 6.30.0
- Tailwind CSS
- Vite

### URLs Importantes

- **Aplicación Frontend**: http://localhost:5173
- **API Backend**: http://localhost:8000/api
- **Admin Django**: http://localhost:8000/admin
- **Documentación API**: http://localhost:8000/api/docs/ (si drf-spectacular está configurado)

### Acceso Rápido

**Iniciar la aplicación**:
```bash
# Terminal 1 - Backend
cd Turismo
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

# Terminal 2 - Frontend
cd Turismo/templates/frontend_react
npm install
npm run dev
```

## Roles de Usuario

| Rol | Permisos |
|-----|----------|
| **Turista** | Ver atractivos y rutas (lectura) |
| **Gestor Turístico** | Crear, editar, publicar atractivos y rutas |
| **Gestor Territorial** | Gestionar cantones y datos geográficos |
| **Investigador** | Crear y publicar proyectos de investigación |
| **Administrador** | Control total del sistema |

## Preguntas Frecuentes

### ¿Cómo renderizo la documentación a PDF?

```bash
quarto render index.qmd --to pdf
```

Se requiere tener LaTeX instalado. Alternativamente, puedes imprimir el HTML a PDF desde el navegador.

### ¿Dónde encuentro información sobre un endpoint específico?

Ver sección **Documentación de API** en `_api.qmd`. Todos los endpoints están listados con ejemplos de uso.

### ¿Cómo agrego un nuevo usuario?

Ver sección **Vista para Administradores** en `_manual_usuario.qmd`, subsección **Gestionar Usuarios**.

### ¿Cómo implemento una nueva funcionalidad?

Ver sección **Workflow de Desarrollo** en `_guia_desarrollador.qmd`.

## Contribuciones

Si encuentras errores en la documentación o falta información:

1. Edita el archivo `.qmd` correspondiente
2. Renderiza para verificar cambios: `quarto preview index.qmd`
3. Realiza commit con descripción clara
4. Solicita revisión

## Contacto y Soporte

- **Documentación Local**: `/sources/documentation/`
- **Repositorio**: Turismo-develop
- **Issues**: Reporta problemas en el proyecto

---

**Última actualización**: 22 de Junio de 2026  
**Versión**: 1.0.0

---
