from django.db import models
from apps.usuarios.models import Persona

class NivelClasificacion(models.TextChoices):
    CATEGORIA = 'CATEGORIA', 'Categoria'
    TIPO = 'TIPO', 'Tipo'
    SUBTIPO = 'SUBTIPO', 'Subtipo'

class NivelAccesibilidad(models.TextChoices):
    LIBRE = 'LIBRE', 'Libre'
    RESTRINGIDO = 'RESTRINGIDO', 'Restringido'
    PAGADO = 'PAGADO', 'Pagado'

class EstadoConservacion(models.TextChoices):
    CONSERVADO = 'CONSERVADO', 'Conservado'
    ALTERADO = 'ALTERADO', 'Alterado'
    EN_DETERIORO = 'EN_DETERIORO', 'En deterioro'
    DETERIORADO = 'DETERIORADO', 'Deteriorado'

class TipoHorario(models.TextChoices):
    NORMAL = 'NORMAL', 'Normal'
    FIN_SEMANA = 'FIN_SEMANA', 'Fin de semana'
    FERIADO = 'FERIADO', 'Feriado'
    ESPECIAL = 'ESPECIAL', 'Especial'

class EstadoRuta(models.TextChoices):
    BUENA = 'BUENA', 'Buena'
    REGULAR = 'REGULAR', 'Regular'
    MALA = 'MALA', 'Mala'
    CERRADA = 'CERRADA', 'Cerrada'

class Clasificacion(models.Model):
    nombre = models.CharField(max_length=255)
    descripcion = models.TextField(blank=True)
    nivel = models.CharField(max_length=20, choices=NivelClasificacion.choices, default=NivelClasificacion.CATEGORIA)
    atractivo_turistico = models.ForeignKey('AtractivoTuristico', on_delete=models.CASCADE, related_name="clasificaciones")
    
    class Meta:
        ordering = ['nombre']

    def __str__(self):
        return self.nombre

class Servicio(models.Model):
    nombre = models.CharField(max_length=255)
    descripcion = models.TextField(blank=True)
    esta_disponible = models.BooleanField(default=True)
    costo = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    atractivo_turistico = models.ForeignKey('AtractivoTuristico', on_delete=models.CASCADE, related_name="servicios")

    class Meta:
        ordering = ['nombre']

    def __str__(self):
        return self.nombre

class Recomendacion(models.Model):
    descripcion = models.TextField()
    atractivo_turistico = models.ForeignKey('AtractivoTuristico', on_delete=models.CASCADE, related_name="recomendaciones")

    class Meta:
        ordering = ['id']

    def __str__(self):
        return f"{self.atractivo_turistico.nombre}: {self.descripcion[:50]}"

class Gerente(Persona):
    institucion = models.CharField(max_length=255)
    es_administrador_publico = models.BooleanField(default=True)
    cargo = models.CharField(max_length=255)
    atractivo_turistico = models.OneToOneField('AtractivoTuristico', on_delete=models.CASCADE, related_name="gerente")

    class Meta:
        ordering = ['apellido', 'nombre']
        
    def __str__(self):
        return f"{self.nombre} {self.apellido}".strip()

class AtractivoTuristico(models.Model):
    nombre = models.CharField(max_length=255)
    descripcion = models.TextField(blank=True)
    nivel_accesibilidad = models.CharField(max_length=20, choices=NivelAccesibilidad.choices, default=NivelAccesibilidad.LIBRE)
    estado_conservacion = models.CharField(max_length=20, choices=EstadoConservacion.choices, default=EstadoConservacion.CONSERVADO)

    class Meta:
        ordering = ['nombre']
        
    def __str__(self):
        return self.nombre

class Ubicacion(models.Model):
    atractivo_turistico = models.OneToOneField('AtractivoTuristico', on_delete=models.SET_NULL, null=True, blank=True, related_name='ubicacion')
    latitud = models.FloatField()
    longitud = models.FloatField()
    altitud = models.FloatField(null=True, blank=True)

    class Meta:
        verbose_name = 'Ubicación'
        verbose_name_plural = 'Ubicaciones'

    def __str__(self):
        return f"Lat: {self.latitud}, Lon: {self.longitud}"

class Direccion(models.Model):
    ubicacion = models.OneToOneField(Ubicacion, on_delete=models.CASCADE, related_name='direccion')
    calle_principal = models.CharField(max_length=255)
    calle_transversal = models.CharField(max_length=255, blank=True)
    numero = models.CharField(max_length=32, blank=True)
    referencia = models.TextField(blank=True)

    class Meta:
        verbose_name = 'Dirección'
        verbose_name_plural = 'Direcciones'

    def __str__(self):
        return f"{self.calle_principal} / {self.calle_transversal}"

class InformacionClimatica(models.Model):
    ubicacion = models.OneToOneField(Ubicacion, on_delete=models.CASCADE, related_name='informacion_climatica')
    clima = models.CharField(max_length=128)
    temperatura_minima = models.IntegerField()
    temperatura_maxima = models.IntegerField()
    precipitacion_minima = models.IntegerField( )
    precipitacion_maxima = models.IntegerField( )

    class Meta:
        verbose_name = 'Información Climática'
        verbose_name_plural = 'Informaciones Climáticas'

    def __str__(self):
        return self.clima

class Horario(models.Model):
    atractivo_turistico = models.ForeignKey('AtractivoTuristico', on_delete=models.CASCADE, related_name="horarios")
    hora_inicio = models.TimeField()
    hora_fin = models.TimeField()
    tipo_horario = models.CharField(max_length=20, choices=TipoHorario.choices, default=TipoHorario.NORMAL)

    class Meta:
        ordering = ['hora_inicio']
        
    def __str__(self):
        return f"{self.tipo_horario}: {self.hora_inicio} - {self.hora_fin}"

class Ruta(models.Model):
    nombre = models.CharField(max_length=255)
    descripcion = models.TextField(blank=True)
    nivel_dificultad = models.PositiveSmallIntegerField(default=1)

    class Meta:
        ordering = ['nombre']

    def __str__(self):
        return self.nombre

class DetalleRuta(models.Model):
    ruta = models.ForeignKey(Ruta, on_delete=models.CASCADE, related_name='detalles_ruta')
    estado = models.CharField(max_length=20, choices=EstadoRuta.choices, default=EstadoRuta.BUENA)
    atractivo = models.ForeignKey(AtractivoTuristico, on_delete=models.CASCADE, related_name='detalles_ruta')
    orden = models.PositiveIntegerField(default=1)

    class Meta:
        ordering = ['orden']
        unique_together = ('ruta', 'atractivo')

    def __str__(self):
        return f"{self.ruta.nombre} - {self.atractivo.nombre} ({self.orden})"
