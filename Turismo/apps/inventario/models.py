from django.db import models

class TipoRecurso(models.TextChoices):
	IMAGEN = 'IMAGEN', 'Imagen'
	VIDEO = 'VIDEO', 'Video'
	DOCUMENTO = 'DOCUMENTO', 'Documento'
	INFOGRAFIA = 'INFOGRAFIA', 'Infografia'

class Recurso(models.Model):
	titulo = models.CharField(max_length=150)
	descripcion = models.TextField(blank=True)
	url = models.URLField(blank=True)
	archivo = models.FileField(upload_to='recursos/', blank=True, null=True)
	fecha_subida = models.DateField(auto_now_add=True)
	tipo_recurso = models.CharField(max_length=20, choices=TipoRecurso.choices)
	atractivo_turistico = models.ForeignKey('atractivos.AtractivoTuristico', on_delete=models.CASCADE, related_name='recursos', null=True, blank=True)

	class Meta:
		ordering = ['-fecha_subida', 'titulo']
  
	def __str__(self):
		return f"{self.titulo} ({self.tipo_recurso})"

TipoPublicacionChoices = models.TextChoices('TipoPublicacionChoices', 'INFOGRAFIA MATERIAL_VISUAL PRESENTACION MAPA_TEMATICO')

class Publicacion(models.Model):
	titulo = models.CharField(max_length=200)
	descripcion = models.TextField(blank=True)
	archivo = models.FileField(upload_to='publicaciones/', blank=True, null=True)
	url_externa = models.URLField(blank=True)
	tipo = models.CharField(max_length=20, choices=TipoPublicacionChoices.choices, default='INFOGRAFIA')
	fecha_publicacion = models.DateField(auto_now_add=True)
	canton = models.ForeignKey('geolocalizacion.Canton', on_delete=models.SET_NULL, null=True, blank=True, related_name='publicaciones')
	ruta = models.ForeignKey('atractivos.Ruta', on_delete=models.SET_NULL, null=True, blank=True, related_name='publicaciones')
	atractivo_turistico = models.ForeignKey('atractivos.AtractivoTuristico', on_delete=models.SET_NULL, null=True, blank=True, related_name='publicaciones')
	activo = models.BooleanField(default=True)

	class Meta:
		ordering = ['-fecha_publicacion', 'titulo']
		verbose_name = 'Publicación'
		verbose_name_plural = 'Publicaciones'

	def __str__(self):
		return self.titulo
