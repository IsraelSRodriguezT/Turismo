from django.contrib import admin
from .models import Recurso

@admin.register(Recurso)
class RecursoAdmin(admin.ModelAdmin):
	list_display = ('atractivo_turistico', 'titulo', 'tipo_recurso', 'fecha_subida')
	search_fields = ('atractivo_turistico__nombre', 'titulo', 'descripcion', 'url')
	list_filter = ('atractivo_turistico', 'tipo_recurso', 'fecha_subida')
