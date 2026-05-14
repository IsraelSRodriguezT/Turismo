from django.conf import settings
from django.db import models
from django.core.exceptions import ValidationError


class ProyectoInvestigacion(models.Model):
    """Proyecto principal de investigación turística."""
    ESTADO_BORRADOR = "borrador"
    ESTADO_EN_PROGRESO = "en_progreso"
    ESTADO_FINALIZADO = "finalizado"
    ESTADO_CANCELADO = "cancelado"

    ESTADOS = [
        (ESTADO_BORRADOR, "Borrador"),
        (ESTADO_EN_PROGRESO, "En progreso"),
        (ESTADO_FINALIZADO, "Finalizado"),
        (ESTADO_CANCELADO, "Cancelado"),
    ]

    titulo = models.CharField(max_length=255, unique=True)
    descripcion = models.TextField()
    fechaInicio = models.DateField()
    fechaFin = models.DateField()
    objetivo = models.TextField()
    estado = models.CharField(max_length=32, choices=ESTADOS, default=ESTADO_BORRADOR, db_index=True)
    responsable = models.ForeignKey(
        settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL, related_name="proyectos_investigacion"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.titulo

    def clean(self):
        if self.fechaFin < self.fechaInicio:
            raise ValidationError({"fechaFin": "fechaFin no puede ser anterior a fechaInicio"})


class Actor(models.Model):
    """Actor/organización involucrada en un proyecto."""
    proyecto = models.ForeignKey(ProyectoInvestigacion, on_delete=models.CASCADE, related_name="actores")
    nombre = models.CharField(max_length=255)
    organizacion = models.CharField(max_length=255)
    rol = models.CharField(max_length=128, blank=True)
    contacto = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return f"{self.nombre} ({self.organizacion})"


class TipoEvidencia(models.TextChoices):
    """Tipos de evidencia de investigación."""
    PRODUCTO = "producto", "Producto"
    RESULTADO = "resultado", "Resultado"
    APRENDIZAJE = "aprendizaje", "Aprendizaje"


class Evidencia(models.Model):
    """Hallazgos, productos y aprendizajes de investigación."""
    proyecto = models.ForeignKey(ProyectoInvestigacion, on_delete=models.CASCADE, related_name="evidencias")
    titulo = models.CharField(max_length=255)
    descripcion = models.TextField()
    fechaRegistro = models.DateField()
    tipoEvidencia = models.CharField(max_length=32, choices=TipoEvidencia.choices, default=TipoEvidencia.RESULTADO)
    recomendacion = models.TextField(blank=True)
    archivo = models.FileField(upload_to="investigacion/evidencias/", null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-fechaRegistro"]

    def __str__(self):
        return f"{self.titulo} ({self.tipoEvidencia})"


class PlanAccion(models.Model):
    """Planes de acción derivados de investigación."""
    ESTADO_PENDIENTE = "pendiente"
    ESTADO_EN_EJECUCION = "en_ejecucion"
    ESTADO_COMPLETADO = "completado"

    ESTADOS = [
        (ESTADO_PENDIENTE, "Pendiente"),
        (ESTADO_EN_EJECUCION, "En ejecución"),
        (ESTADO_COMPLETADO, "Completado"),
    ]

    proyecto = models.ForeignKey(ProyectoInvestigacion, on_delete=models.CASCADE, related_name="planes_accion")
    nombre = models.CharField(max_length=255)
    descripcion = models.TextField()
    fechaInicio = models.DateField()
    fechaFin = models.DateField()
    estado = models.CharField(max_length=32, choices=ESTADOS, default=ESTADO_PENDIENTE)
    responsable = models.CharField(max_length=255, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-fechaInicio"]

    def __str__(self):
        return self.nombre

    def clean(self):
        if self.fechaFin < self.fechaInicio:
            raise ValidationError({"fechaFin": "fechaFin no puede ser anterior a fechaInicio"})


class Impacto(models.Model):
    """Evaluación de impactos del proyecto."""
    proyecto = models.ForeignKey(ProyectoInvestigacion, on_delete=models.CASCADE, related_name="impactos")
    descripcion = models.TextField()
    nivelImpacto = models.PositiveSmallIntegerField(help_text="Nivel de impacto (1-10)")
    fechaEvaluacion = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-nivelImpacto"]

    def __str__(self):
        return f"Impacto nivel {self.nivelImpacto} - {self.proyecto.titulo}"

    def clean(self):
        if not (1 <= self.nivelImpacto <= 10):
            raise ValidationError({"nivelImpacto": "nivelImpacto debe estar entre 1 y 10"})
