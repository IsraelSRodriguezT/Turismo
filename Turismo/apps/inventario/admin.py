from django.contrib import admin
from .models import Publicacion, Recurso

@admin.register(Recurso)
class RecursoAdmin(admin.ModelAdmin):
	list_display = ('atractivo_turistico', 'titulo', 'tipo_recurso', 'fecha_subida')
	search_fields = ('atractivo_turistico__nombre', 'titulo', 'descripcion', 'url')
	list_filter = ('atractivo_turistico', 'tipo_recurso', 'fecha_subida')

@admin.register(Publicacion)
class PublicacionAdmin(admin.ModelAdmin):
	list_display = ('titulo', 'tipo', 'canton', 'fecha_publicacion', 'activo')
	list_filter = ('tipo', 'canton', 'activo')
	search_fields = ('titulo', 'descripcion')
