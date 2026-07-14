# Flujo de Navegacion

## Parte Publica

```mermaid
flowchart TD
    A[Inicio] <--> |Ir/Volver| B[Iniciar Sesion]
    A <--> |Ir/Volver| C[Registrarse]
    B <--> |Ir/Volver| C
    B --> D[Recuperar Contraseña]
    B --> |Ingresar al sistema| E[Dashboard]
```

## Parte Privada

### Usuarios Administrativos 
>  - Administradores 
>  - Gestores Territoriales 
>  - Gestores Turisticos
>  - Investigadores
---
#### Modulo de Usuarios

```mermaid
flowchart TD
    A[Dashboard] <--> |Gestion/Volver| B[Usuarios]
    A <--> |Gestion/Volver| C[Perfil]
    A <--> E[Configuracion]
    A --> |Salir del sistema| F[Cerrar Sesion]
```
---
#### Modulo de Geolocalizacion

```mermaid
flowchart TD
    A[Dashboard] <--> B((Geolocalizacion))
    B <--> |Gestion/Volver| C[Paises]
    C <--> |Gestion/Volver| D[Provincias]
    D <--> |Gestion/Volver| E[Cantones]
    E <--> |Gestion/Volver| F[Parroquias]
    F <--> |Gestion/Volver| G[Sectores]
```
---
#### Modulo de Atractivos e Inventario

```mermaid
flowchart TD
    A[Dashboard] <--> B((Inventario))
    B <--> |Gestion/Volver| C[Atractivos]
    B <--> |Gestion/Volver| D[Clasificaciones] 
    B <--> E[Reportes]
```
---
#### Modulo de Investigacion

```mermaid
flowchart TD
    A[Dashboard] <--> B((Investigacion))
    B <--> |Gestion/Volver| C[Proyectos de Investigacion]
```
---
### Usuarios Generales 
> - Turistas
---
#### Modulo de Usuarios

```mermaid
flowchart TD
    A[Dashboard] <--> |Gestion/Volver| B[Perfil]
    B <--> C[Favoritos]
    B <--> D[Valoraciones]
    A <--> E[Configuracion]
    A --> |Salir del sistema| F[Cerrar Sesion]
```
---
#### Modulo de Geolocalizacion

```mermaid
flowchart TD
    A[Dashboard]
```
---
#### Modulo de Atractivos e Inventario

```mermaid
flowchart TD
    A[Dashboard] <--> B[Atractivos]
```
---
#### Modulo de Investigacion

```mermaid
flowchart TD
    A[Dashboard] <--> B[Proyectos de Investigacion]
```
---