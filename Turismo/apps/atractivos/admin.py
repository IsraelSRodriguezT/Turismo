from django.contrib import admin

from apps.atractivos.models import (
    AtractivoTuristico,
    Clasificacion,
    DetalleRuta,
    Direccion,
    Gerente,
    Horario,
    InformacionClimatica,
    Recomendacion,
    Ruta,
    Servicio,
    Ubicacion,
)


@admin.register(Clasificacion)
class ClasificacionAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'nivel')
    search_fields = ('nombre', 'descripcion')
    list_filter = ('nivel',)


@admin.register(Servicio)
class ServicioAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'esta_disponible', 'costo')
    list_filter = ('esta_disponible',)
    search_fields = ('nombre', 'descripcion')


@admin.register(Gerente)
class GerenteAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'apellido', 'institucion', 'cargo', 'es_administrador_publico')
    search_fields = ('nombre', 'apellido', 'institucion', 'cargo')
    list_filter = ('es_administrador_publico',)


@admin.register(Horario)
class HorarioAdmin(admin.ModelAdmin):
    list_display = ('tipo_horario', 'hora_inicio', 'hora_fin')
    list_filter = ('tipo_horario',)


@admin.register(Ruta)
class RutaAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'nivel_dificultad', 'estado')
    list_filter = ('estado',)
    search_fields = ('nombre', 'descripcion')


@admin.register(AtractivoTuristico)
class AtractivoTuristicoAdmin(admin.ModelAdmin):
    list_display = (
        'nombre',
        'nivel_clasificacion',
        'nivel_accesibilidad',
        'estado_conservacion',
        'estado_publicacion',
        'gerente',
    )
    list_filter = (
        'nivel_clasificacion',
        'nivel_accesibilidad',
        'estado_conservacion',
        'estado_publicacion',
    )
    search_fields = ('nombre', 'descripcion')
    filter_horizontal = ('clasificaciones', 'servicios', 'recomendaciones', 'horarios')


@admin.register(Ubicacion)
class UbicacionAdmin(admin.ModelAdmin):
    list_display = ('atractivo', 'canton', 'latitud', 'longitud')
    search_fields = ('atractivo__nombre', 'canton')


@admin.register(Direccion)
class DireccionAdmin(admin.ModelAdmin):
    list_display = ('ubicacion', 'calle_principal', 'calle_transversal')
    search_fields = ('ubicacion__atractivo__nombre', 'calle_principal', 'calle_transversal')


@admin.register(InformacionClimatica)
class InformacionClimaticaAdmin(admin.ModelAdmin):
    list_display = ('ubicacion', 'clima', 'temperatura_actual')
    search_fields = ('ubicacion__atractivo__nombre', 'clima')


@admin.register(Recomendacion)
class RecomendacionAdmin(admin.ModelAdmin):
    list_display = ('descripcion',)
    search_fields = ('descripcion',)


@admin.register(DetalleRuta)
class DetalleRutaAdmin(admin.ModelAdmin):
    list_display = ('ruta', 'atractivo', 'orden')
    list_filter = ('ruta',)
