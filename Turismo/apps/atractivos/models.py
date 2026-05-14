from django.db import models


class NivelClasificacion(models.TextChoices):
    CATEGORIA = 'CATEGORIA', 'CATEGORIA'
    TIPO = 'TIPO', 'TIPO'
    SUBTIPO = 'SUBTIPO', 'SUBTIPO'


class NivelAccesibilidad(models.TextChoices):
    LIBRE = 'LIBRE', 'LIBRE'
    RESTRINGIDO = 'RESTRINGIDO', 'RESTRINGIDO'
    PAGADO = 'PAGADO', 'PAGADO'


class EstadoConservacion(models.TextChoices):
    CONSERVADO = 'CONSERVADO', 'CONSERVADO'
    ALTERADO = 'ALTERADO', 'ALTERADO'
    EN_DETERIORO = 'EN_DETERIORO', 'EN_DETERIORO'
    DETERIORADO = 'DETERIORADO', 'DETERIORADO'


class TipoHorario(models.TextChoices):
    NORMAL = 'NORMAL', 'NORMAL'
    FIN_SEMANA = 'FIN_SEMANA', 'FIN DE SEMANA'
    FERIADO = 'FERIADO', 'FERIADO'
    ESPECIAL = 'ESPECIAL', 'ESPECIAL'


class EstadoRuta(models.TextChoices):
    BUENA = 'BUENA', 'BUENA'
    REGULAR = 'REGULAR', 'REGULAR'
    MALA = 'MALA', 'MALA'
    CERRADA = 'CERRADA', 'CERRADA'


class EstadoPublicacion(models.TextChoices):
    BORRADOR = 'BORRADOR', 'BORRADOR'
    REVISION = 'REVISION', 'REVISION'
    PUBLICADO = 'PUBLICADO', 'PUBLICADO'
    ARCHIVADO = 'ARCHIVADO', 'ARCHIVADO'


class Clasificacion(models.Model):
    nombre = models.CharField(max_length=255)
    descripcion = models.TextField(blank=True)
    nivel = models.CharField(
        max_length=20,
        choices=NivelClasificacion.choices,
        default=NivelClasificacion.CATEGORIA,
    )

    class Meta:
        ordering = ['nombre']

    def __str__(self):
        return self.nombre


class Servicio(models.Model):
    nombre = models.CharField(max_length=255)
    descripcion = models.TextField(blank=True)
    esta_disponible = models.BooleanField(default=True)
    costo = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    class Meta:
        ordering = ['nombre']

    def __str__(self):
        return self.nombre


class Recomendacion(models.Model):
    descripcion = models.TextField()

    class Meta:
        ordering = ['id']

    def __str__(self):
        return self.descripcion[:50]


class Gerente(models.Model):
    nombre = models.CharField(max_length=255)
    apellido = models.CharField(max_length=255)
    institucion = models.CharField(max_length=255, blank=True)
    es_administrador_publico = models.BooleanField(default=False)
    cargo = models.CharField(max_length=255, blank=True)

    class Meta:
        ordering = ['apellido', 'nombre']

    def __str__(self):
        return f"{self.nombre} {self.apellido}".strip()


class AtractivoTuristico(models.Model):
    nombre = models.CharField(max_length=255)
    descripcion = models.TextField(blank=True)
    nivel_clasificacion = models.CharField(
        max_length=20,
        choices=NivelClasificacion.choices,
        default=NivelClasificacion.CATEGORIA,
    )
    nivel_accesibilidad = models.CharField(
        max_length=20,
        choices=NivelAccesibilidad.choices,
        default=NivelAccesibilidad.LIBRE,
    )
    estado_conservacion = models.CharField(
        max_length=20,
        choices=EstadoConservacion.choices,
        default=EstadoConservacion.CONSERVADO,
    )
    estado_publicacion = models.CharField(
        max_length=20,
        choices=EstadoPublicacion.choices,
        default=EstadoPublicacion.BORRADOR,
    )
    gerente = models.ForeignKey(
        Gerente,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='atractivos',
    )
    clasificaciones = models.ManyToManyField(
        Clasificacion,
        blank=True,
        related_name='atractivos',
    )
    servicios = models.ManyToManyField(
        Servicio,
        blank=True,
        related_name='atractivos',
    )
    recomendaciones = models.ManyToManyField(
        Recomendacion,
        blank=True,
        related_name='atractivos',
    )
    horarios = models.ManyToManyField(
        'Horario',
        blank=True,
        related_name='atractivos',
    )
    rutas = models.ManyToManyField(
        'Ruta',
        through='DetalleRuta',
        blank=True,
        related_name='atractivos',
    )
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['nombre']

    def __str__(self):
        return self.nombre


class Ubicacion(models.Model):
    atractivo = models.OneToOneField(
        AtractivoTuristico,
        on_delete=models.CASCADE,
        related_name='ubicacion',
    )
    latitud = models.FloatField()
    longitud = models.FloatField()
    altitud = models.FloatField(null=True, blank=True)
    canton = models.CharField(max_length=128, blank=True)

    class Meta:
        verbose_name = 'Ubicación'
        verbose_name_plural = 'Ubicaciones'

    def __str__(self):
        return f"{self.canton or 'Ubicación'} ({self.latitud}, {self.longitud})"


class Direccion(models.Model):
    ubicacion = models.OneToOneField(
        Ubicacion,
        on_delete=models.CASCADE,
        related_name='direccion',
    )
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
    ubicacion = models.OneToOneField(
        Ubicacion,
        on_delete=models.CASCADE,
        related_name='informacion_climatica',
    )
    clima = models.CharField(max_length=128, blank=True)
    temperatura_minima = models.IntegerField(null=True, blank=True)
    temperatura_maxima = models.IntegerField(null=True, blank=True)
    temperatura_actual = models.FloatField(null=True, blank=True)
    precipitacion_minima = models.IntegerField(null=True, blank=True)
    precipitacion_maxima = models.IntegerField(null=True, blank=True)

    class Meta:
        verbose_name = 'Información Climática'
        verbose_name_plural = 'Informaciones Climáticas'

    def __str__(self):
        return self.clima or 'Clima sin definir'


class Horario(models.Model):
    hora_inicio = models.TimeField()
    hora_fin = models.TimeField()
    tipo_horario = models.CharField(
        max_length=20,
        choices=TipoHorario.choices,
        default=TipoHorario.NORMAL,
    )

    class Meta:
        ordering = ['hora_inicio']

    def __str__(self):
        return f"{self.get_tipo_horario_display()} {self.hora_inicio} - {self.hora_fin}"


class Ruta(models.Model):
    nombre = models.CharField(max_length=255)
    descripcion = models.TextField(blank=True)
    distancia = models.FloatField(null=True, blank=True)
    duracion = models.FloatField(null=True, blank=True)
    nivel_dificultad = models.PositiveSmallIntegerField(default=1)
    estado = models.CharField(
        max_length=20,
        choices=EstadoRuta.choices,
        default=EstadoRuta.BUENA,
    )

    class Meta:
        ordering = ['nombre']

    def __str__(self):
        return self.nombre


class DetalleRuta(models.Model):
    ruta = models.ForeignKey(
        Ruta,
        on_delete=models.CASCADE,
        related_name='detalles',
    )
    atractivo = models.ForeignKey(
        AtractivoTuristico,
        on_delete=models.CASCADE,
        related_name='detalle_rutas',
    )
    orden = models.PositiveIntegerField(default=1)

    class Meta:
        ordering = ['orden']
        unique_together = ('ruta', 'atractivo')

    def __str__(self):
        return f"{self.ruta.nombre} - {self.atractivo.nombre} ({self.orden})"
