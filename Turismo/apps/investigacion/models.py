from django.db import models
from django.core.exceptions import ValidationError
from apps.usuarios.models import Persona

class TipoEvidencia(models.TextChoices):
	PRODUCTO = 'PRODUCTO', 'Producto'
	RESULTADO = 'RESULTADO', 'Resultado'
	APRENDIZAJE = 'APRENDIZAJE', 'Aprendizaje'

class ProyectoInvestigacion(models.Model):
    titulo = models.CharField(max_length=255, unique=True)
    descripcion = models.TextField()
    fecha_inicio = models.DateField()
    fecha_fin = models.DateField()
    objetivo = models.TextField()
    sector = models.ForeignKey('geolocalizacion.Sector', on_delete=models.SET_NULL, related_name='+', null=True, blank=True)

    class Meta:
        ordering = ["-fecha_inicio"]
    
    def __str__(self):
        return self.titulo

    def clean(self):
        if self.fecha_fin < self.fecha_inicio:
            raise ValidationError({"fecha_fin": "fecha_fin no puede ser anterior a fecha_inicio"})

class Actor(Persona):
    proyecto = models.ForeignKey(ProyectoInvestigacion, on_delete=models.CASCADE, related_name="actores")
    organizacion = models.CharField(max_length=255)

    def __str__(self):
        return f"{self.nombre} ({self.organizacion})"

class Evidencia(models.Model):
    proyecto = models.ForeignKey(ProyectoInvestigacion, on_delete=models.CASCADE, related_name="evidencias")
    titulo = models.CharField(max_length=255)
    descripcion = models.TextField()
    fecha_registro = models.DateField(auto_now_add=True)
    tipo_evidencia = models.CharField(max_length=32, choices=TipoEvidencia.choices, default=TipoEvidencia.RESULTADO)
    recomendacion = models.TextField(blank=True)

    class Meta:
        ordering = ["-fecha_registro"]

    def __str__(self):
        return f"{self.titulo} ({self.tipo_evidencia})"

class PlanAccion(models.Model):
    proyecto = models.ForeignKey(ProyectoInvestigacion, on_delete=models.CASCADE, related_name="planes_accion")
    nombre = models.CharField(max_length=255)
    descripcion = models.TextField()
    fecha_inicio = models.DateField()
    fecha_fin = models.DateField()

    class Meta:
        ordering = ["-fecha_inicio"]

    def __str__(self):
        return self.nombre

    def clean(self):
        if self.fecha_fin < self.fecha_inicio:
            raise ValidationError({"fecha_fin": "fecha_fin no puede ser anterior a fecha_inicio"})

class Impacto(models.Model):
    proyecto = models.ForeignKey(ProyectoInvestigacion, on_delete=models.CASCADE, related_name="impactos")
    descripcion = models.TextField()
    nivel_impacto = models.PositiveSmallIntegerField(help_text="Nivel de impacto (1-10)")
    fecha_evaluacion = models.DateField()

    class Meta:
        ordering = ["-nivel_impacto"]

    def __str__(self):
        return f"Impacto nivel {self.nivel_impacto} - {self.proyecto.titulo}"

    def clean(self):
        if not (1 <= self.nivel_impacto <= 10):
            raise ValidationError({"nivel_impacto": "nivel_impacto debe estar entre 1 y 10"})
