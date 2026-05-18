from django.db import transaction
from django.shortcuts import get_object_or_404
from django.db.models import Q
from .models import ProyectoInvestigacion, Evidencia, Actor, PlanAccion, Impacto


def crear_proyecto(data, usuario=None):
    """Crear nuevo proyecto de investigación."""
    with transaction.atomic():
        if usuario and not data.get("responsable"):
            data["responsable"] = usuario
        proyecto = ProyectoInvestigacion.objects.create(**data)
    return proyecto


def actualizar_proyecto(pk, data, usuario=None):
    """Actualizar proyecto existente."""
    proyecto = get_object_or_404(ProyectoInvestigacion, pk=pk)
    for k, v in data.items():
        setattr(proyecto, k, v)
    proyecto.full_clean()
    proyecto.save()
    return proyecto


def listar_proyectos(filters=None):
    """Listar proyectos con filtros opcionales."""
    qs = ProyectoInvestigacion.objects.all()
    if not filters:
        return qs
    
    if "estado" in filters:
        qs = qs.filter(estado=filters["estado"])
    if "responsable" in filters:
        qs = qs.filter(responsable_id=filters["responsable"])
    if "q" in filters:  # búsqueda por titulo, descripcion, objetivo
        q = filters["q"]
        qs = qs.filter(Q(titulo__icontains=q) | Q(descripcion__icontains=q) | Q(objetivo__icontains=q))
    if "fechaInicio_gte" in filters:
        qs = qs.filter(fechaInicio__gte=filters["fechaInicio_gte"])
    if "fechaFin_lte" in filters:
        qs = qs.filter(fechaFin__lte=filters["fechaFin_lte"])
    
    return qs


def agregar_actor(proyecto, actor_data, usuario=None):
    """Añadir actor a un proyecto."""
    if isinstance(proyecto, int):
        proyecto = ProyectoInvestigacion.objects.get(pk=proyecto)
    actor = Actor.objects.create(proyecto=proyecto, **actor_data)
    return actor


def agregar_evidencia(proyecto, evidencia_data, usuario=None):
    """Añadir evidencia a un proyecto."""
    if isinstance(proyecto, int):
        proyecto = ProyectoInvestigacion.objects.get(pk=proyecto)
    evidencia = Evidencia.objects.create(proyecto=proyecto, **evidencia_data)
    return evidencia


def agregar_plan_accion(proyecto, plan_data, usuario=None):
    """Añadir plan de acción a un proyecto."""
    if isinstance(proyecto, int):
        proyecto = ProyectoInvestigacion.objects.get(pk=proyecto)
    plan = PlanAccion.objects.create(proyecto=proyecto, **plan_data)
    return plan


def agregar_impacto(proyecto, impacto_data, usuario=None):
    """Añadir impacto a un proyecto."""
    if isinstance(proyecto, int):
        proyecto = ProyectoInvestigacion.objects.get(pk=proyecto)
    impacto = Impacto.objects.create(proyecto=proyecto, **impacto_data)
    return impacto


def obtener_proyecto_detalle(pk):
    """Obtener proyecto con todas sus relaciones (actores, evidencias, planes, impactos)."""
    return (
        ProyectoInvestigacion.objects.prefetch_related("actores", "evidencias", "planes_accion", "impactos")
        .get(pk=pk)
    )
