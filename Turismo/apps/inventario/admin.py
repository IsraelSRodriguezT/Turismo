from django.contrib import admin

from .models import Recurso


@admin.register(Recurso)
class RecursoAdmin(admin.ModelAdmin):
	list_display = ('titulo', 'tipo_recurso', 'fecha_subida')
	search_fields = ('titulo', 'descripcion', 'url')
	list_filter = ('tipo_recurso', 'fecha_subida')
