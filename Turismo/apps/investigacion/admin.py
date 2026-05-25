from django.contrib import admin
from .models import Actor, Evidencia, Impacto, PlanAccion, ProyectoInvestigacion


@admin.register(ProyectoInvestigacion)
class ProyectoInvestigacionAdmin(admin.ModelAdmin):
	list_display = ('titulo', 'fecha_inicio', 'fecha_fin')
	list_filter = ('fecha_inicio', 'fecha_fin')
	search_fields = ('titulo', 'descripcion', 'objetivo')


@admin.register(Actor)
class ActorAdmin(admin.ModelAdmin):
	list_display = ('nombre', 'organizacion', 'proyecto')
	list_filter = ('organizacion',)
	search_fields = ('nombre', 'organizacion', 'proyecto__titulo')


@admin.register(PlanAccion)
class PlanAccionAdmin(admin.ModelAdmin):
	list_display = ('nombre', 'proyecto', 'fecha_inicio', 'fecha_fin')
	list_filter = ('fecha_inicio', 'fecha_fin')
	search_fields = ('nombre', 'descripcion', 'proyecto__titulo')


@admin.register(Impacto)
class ImpactoAdmin(admin.ModelAdmin):
	list_display = ('proyecto', 'nivel_impacto', 'fecha_evaluacion')
	list_filter = ('nivel_impacto', 'fecha_evaluacion')
	search_fields = ('descripcion', 'proyecto__titulo')


@admin.register(Evidencia)
class EvidenciaAdmin(admin.ModelAdmin):
	list_display = ('titulo', 'tipo_evidencia', 'proyecto', 'fecha_registro')
	list_filter = ('tipo_evidencia', 'fecha_registro')
	search_fields = ('titulo', 'descripcion', 'recomendacion', 'proyecto__titulo')
