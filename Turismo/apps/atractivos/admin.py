from django.contrib import admin
from apps.atractivos.models import AtractivoTuristico, Clasificacion, DetalleRuta, Direccion, Gerente, Horario, InformacionClimatica, Recomendacion, Ruta, Servicio, Ubicacion

@admin.register(Clasificacion)
class ClasificacionAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'nivel', 'atractivo_turistico')
    search_fields = ('nombre', 'descripcion', 'atractivo_turistico__nombre')
    list_filter = ('nivel',)

@admin.register(Servicio)
class ServicioAdmin(admin.ModelAdmin):
    list_display = ('atractivo_turistico', 'nombre', 'esta_disponible', 'costo')
    list_filter = ('atractivo_turistico', 'esta_disponible')
    search_fields = ('nombre', 'descripcion', 'atractivo_turistico__nombre')

@admin.register(Gerente)
class GerenteAdmin(admin.ModelAdmin):
    list_display = ('atractivo_turistico', 'nombre', 'apellido', 'institucion', 'cargo', 'es_administrador_publico')
    search_fields = ('atractivo_turistico__nombre', 'nombre', 'apellido', 'institucion', 'cargo')
    list_filter = ('es_administrador_publico',)

@admin.register(Horario)
class HorarioAdmin(admin.ModelAdmin):
    list_display = ('atractivo_turistico', 'tipo_horario', 'hora_inicio', 'hora_fin')
    list_filter = ('atractivo_turistico', 'tipo_horario')

@admin.register(Ruta)
class RutaAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'nivel_dificultad')
    list_filter = ('nivel_dificultad',)
    search_fields = ('nombre', 'descripcion')

@admin.register(AtractivoTuristico)
class AtractivoTuristicoAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'nivel_accesibilidad', 'estado_conservacion', 'gerente')
    list_filter = ('nivel_accesibilidad', 'estado_conservacion')
    search_fields = ('gerente__nombre', 'nombre', 'descripcion')

@admin.register(Ubicacion)
class UbicacionAdmin(admin.ModelAdmin):
    list_display = ('atractivo_turistico', 'latitud', 'longitud', 'altitud')
    search_fields = ('atractivo_turistico__nombre',)

@admin.register(Direccion)
class DireccionAdmin(admin.ModelAdmin):
    list_display = ('ubicacion', 'calle_principal', 'calle_transversal')
    search_fields = ('ubicacion__atractivo_turistico__nombre', 'calle_principal', 'calle_transversal')

@admin.register(InformacionClimatica)
class InformacionClimaticaAdmin(admin.ModelAdmin):
    list_display = ('ubicacion', 'clima', 'temperatura_minima', 'temperatura_maxima')
    search_fields = ('ubicacion__atractivo_turistico__nombre', 'clima')

@admin.register(Recomendacion)
class RecomendacionAdmin(admin.ModelAdmin):
    list_display = ('atractivo_turistico', 'descripcion')
    search_fields = ('atractivo_turistico__nombre', 'descripcion')

@admin.register(DetalleRuta)
class DetalleRutaAdmin(admin.ModelAdmin):
    list_display = ('ruta', 'atractivo', 'orden')
    list_filter = ('ruta',)