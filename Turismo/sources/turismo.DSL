workspace "PIT" "Plataforma Interactiva de Turismo" {

    model {
        // 1. Usuario General (para Nivel 1 - Contexto)
        usuarioGeneral = person "Usuario General" "Accede a la plataforma"

        // 2. Usuarios Específicos (para Nivel 2 - Contenedores)
        administrador = person "Administrador" "Administra la plataforma" "Administrador"
        gestorTerritorial = person "Gestor Territorial" "Gestiona información territorial" "Gestor Territorial"
        gestorTuristico = person "Gestor Turístico" "Gestiona contenido turístico" "Gestor Turístico"
        investigador = person "Investigador" "Gestiona y valida contenidos" "Investigador"
        turista = person "Turista" "Consulta atractivos y rutas" "Turista"

        // 3. Sistemas Externos
        inami = softwareSystem "INAMI" "Servicio de clima"
        ecu911 = softwareSystem "ECU 911" "Estado de vías"

        // 4. Sistema Principal (PIT)
        plataforma = softwareSystem "PIT" "Plataforma Interactiva de Turismo" {
            
            // CONTENEDORES (Nivel 2)
            frontend = container "Frontend" "Interfaz web para usuarios" "React"
            appMovil = container "App Móvil" "Aplicación móvil para turistas" "React Native"
            backend = container "Backend" "API REST de lógica de negocio" "Django REST Framework" {
                // NIVEL 3: COMPONENTES DEL BACKEND
                
                // ENTRADA HTTP
                views = component "Views" "Reciben requests HTTP y delegan la ejecución a services"
                
                // VALIDACIÓN Y TRANSFORMACIÓN
                serializers = component "Serializers" "Validan, normalizan y convierten datos entre JSON y objetos Python"
                
                // LÓGICA DE NEGOCIO
                services = component "Services" "Contienen la lógica de negocio y coordinan reglas del dominio"
                
                // DATOS Y PERSISTENCIA
                models = component "Models" "Representan y persisten la información del dominio"
                
                // AUTENTICACIÓN Y AUTORIZACIÓN
                auth = component "Auth" "Gestiona autenticación, autorización y control de acceso"
                
                // INTEGRACIONES CON SERVICIOS EXTERNOS
                integrations = component "Integrations" "Conecta el backend con servicios externos y sus APIs"
            }
            db = container "Base de Datos" "Almacena información del sistema" "PostgreSQL/SQLite" {
                tags "Database"
            }
        }
        
        // Relaciones Nivel 1 (Contexto)
        usuarioGeneral -> plataforma "Usa" "HTTPS"
        
        // Relaciones Nivel 2 (Contenedores)
        administrador -> frontend "Administra desde" "HTTPS"
        gestorTerritorial -> frontend "Consulta y gestiona desde" "HTTPS"
        gestorTuristico -> frontend "Consulta y gestiona desde" "HTTPS"
        investigador -> frontend "Administra datos en" "HTTPS"
        turista -> frontend "Navega en" "HTTPS"
        turista -> appMovil "Accede desde" "HTTPS"
        
        frontend -> views "Consume API" "JSON/HTTPS"
        appMovil -> views "Consume API" "JSON/HTTPS"
        
        backend -> db "Almacenan datos en" "ORM/SQL"
        
        // Relaciones internas del Backend (Nivel 3)
        // FLUJO HTTP: Request entra por Views
        views -> auth "Valida token y permisos"
        views -> serializers "Valida datos entrantes"
        
        // VIEWS DELEGA A SERVICES (separación de responsabilidades)
        views -> services "Delega lógica de negocio a"
        
        // SERVICES contiene la lógica principal
        services -> models "Consulta y actualiza datos"
        services -> integrations "Consume servicios externos"
        
        // SERIALIZERS trabaja con Models
        serializers -> models "Convierte entre JSON y objetos Python"
        
        // Models almacenan datos en BD
        models -> db "Almacenan datos en" "ORM/SQL"
        
        // INTEGRATIONS consulta servicios externos (INAMI, ECU911)
        integrations -> inami "Solicita datos de clima" "REST/HTTPS"
        integrations -> ecu911 "Consulta estado de vías" "REST/HTTPS"
        
        // RELACIONES INTERNAS DEL FRONTEND (Nivel 3)
        // FLUJO DE APLICACIÓN: Router renderiza Pages
        appRouter -> appHome "Renderiza"
        appRouter -> appAbout "Renderiza"
        appRouter -> appUserProfile "Renderiza"
        appRouter -> appLogin "Renderiza"
        appRouter -> appDashboard "Renderiza"
        
        // App contiene Router y Nav
        app -> appRouter "Contiene"
        app -> appNav "Contiene"
        
        // Pages consumen Services
        appHome -> usuarios "Consume datos de"
        appHome -> atractivos "Consume datos de"
        appHome -> geolocalizacion "Consume datos de"
        appAbout -> usuarios "Consume datos de"
        appUserProfile -> usuarios "Consume datos de"
        appDashboard -> inventario "Consume datos de"
        appDashboard -> investigacion "Consume datos de"
        
        // Services consumen HttpClient
        usuarios -> httpClient "Usa"
        atractivos -> httpClient "Usa"
        geolocalizacion -> httpClient "Usa"
        inventario -> httpClient "Usa"
        investigacion -> httpClient "Usa"
        
        // Contexts proveen estado a Components
        contexts -> app "Provee estado a"
        contexts -> appHome "Provee estado a"
        contexts -> appAbout "Provee estado a"
        contexts -> appUserProfile "Provee estado a"
        contexts -> appDashboard "Provee estado a"
        
        // Utils proveen utilidades a Components
        utils -> app "Provee utilidades a"
        utils -> appHome "Provee utilidades a"
        utils -> appAbout "Provee utilidades a"
        utils -> appUserProfile "Provee utilidades a"
        utils -> appDashboard "Provee utilidades a"
        utils -> usuarios "Provee utilidades a"
        utils -> atractivos "Provee utilidades a"
        utils -> geolocalizacion "Provee utilidades a"
        utils -> inventario "Provee utilidades a"
        utils -> investigacion "Provee utilidades a"
        
        // Styles aplican a Components
        styles -> app "Aplica estilos a"
        styles -> appHome "Aplica estilos a"
        styles -> appAbout "Aplica estilos a"
        styles -> appUserProfile "Aplica estilos a"
        styles -> appDashboard "Aplica estilos a"
        styles -> appNav "Aplica estilos a"
        styles -> appCardIndicator "Aplica estilos a"
    }

    views {
        // VISTA NIVEL 1: Contexto (Usuario General, PIT y Sistemas Externos)
        systemContext plataforma "Contexto" {
            include usuarioGeneral plataforma inami ecu911
            autoLayout tb
        }

        // VISTA NIVEL 2: Contenedores (Roles específicos como subdivisión)
        container plataforma "Contenedores" {
            include *
            autoLayout tb
        }

        // VISTA NIVEL 3: Componentes
        component backend "BackendComponents" {
            include *
            autoLayout tb
        }
        
        component frontend "FrontendComponents" {
            // COMPONENTES DEL FRONTEND
            
            // LAYOUT Y ROUTING
            app = component "App" "Layout principal de React con navegación y header/footer"
            appRouter = component "Router" "Configuración de rutas con react-router-dom"
            
            // COMPONENTES DE UI
            appNav = component "Nav" "Barra de navegación reutilizable"
            appCardIndicator = component "CardIndicator" "Componente de indicador de tarjeta"
            
            // PÁGINAS (Vistas de ruta)
            appHome = component "Home" "Página de inicio"
            appAbout = component "About" "Página de información"
            appUserProfile = component "UserProfile" "Perfil de usuario"
            appLogin = component "Login" "Página de inicio de sesión"
            appDashboard = component "Dashboard" "Panel de control"
            
            // SERVICIOS DE DATOS
            httpClient = component "HttpClient" "Cliente HTTP centralizado con interceptores de autenticación"
            
            // SERVICIOS POR DOMINIO
            usuarios = component "Usuarios" "Servicios para gestión de usuarios"
            atractivos = component "Atractivos" "Servicios para gestión de atractivos turísticos"
            geolocalizacion = component "Geolocalizacion" "Servicios para ubicación y mapas"
            inventario = component "Inventario" "Servicios para gestión de inventario"
            investigacion = component "Investigacion" "Servicios para gestión de investigación"
            
            // APOYO Y UTILIDADES
            contexts = component "Contexts" "Proveedores de estado global (React Context)"
            hooks = component "Hooks" "Hooks personalizados reutilizables"
            utils = component "Utils" "Utilidades compartidas"
            styles = component "Styles" "Estilos globales CSS"
        }

        // BLOQUE DE ESTILOS
        styles {
            element "Software System" { 
                background #1168bd 
                color #ffffff 
                shape roundedbox 
            }
            element "Container" { 
                background #438dd5 
                color #ffffff 
                shape roundedbox 
            }
            element "Component" { 
                background #85bbf0 
                color #000000 
                shape roundedbox 
            }
            element "Person" { 
                background #08427b 
                color #ffffff 
                shape person 
            }
            element "Database" { 
                shape cylinder 
            }
        }
    }
}