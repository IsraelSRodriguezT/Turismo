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
	atractivo_turistico = models.ForeignKey('atractivos.AtractivoTuristico', on_delete=models.CASCADE, related_name='recursos')

	class Meta:
		ordering = ['-fecha_subida', 'titulo']
  
	def __str__(self):
		return f"{self.titulo} ({self.tipo_recurso})"
