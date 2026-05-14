from django.db import models


class TipoRecurso(models.TextChoices):
	IMAGEN = 'IMAGEN', 'Imagen'
	VIDEO = 'VIDEO', 'Video'
	DOCUMENTO = 'DOCUMENTO', 'Documento'
	INFOGRAFIA = 'INFOGRAFIA', 'Infografia'


class Recurso(models.Model):
	titulo = models.CharField(max_length=150)
	descripcion = models.TextField(blank=True)
	url = models.URLField()
	fecha_subida = models.DateField(auto_now_add=True)
	tipo_recurso = models.CharField(max_length=20, choices=TipoRecurso.choices)

	class Meta:
		ordering = ['-fecha_subida', 'titulo']

	def __str__(self):
		return self.titulo
