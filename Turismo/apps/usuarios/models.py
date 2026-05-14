from __future__ import annotations

from django.conf import settings
from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.core.exceptions import ValidationError
from django.db import models
from django.db.models import Avg


class Rol(models.TextChoices):
	ADMINISTRADOR = 'ADMINISTRADOR', 'Administrador'
	GESTOR_TERRITORIAL = 'GESTOR_TERRITORIAL', 'Gestor Territorial'
	GESTOR_TURISTICO = 'GESTOR_TURISTICO', 'Gestor Turistico'
	INVESTIGADOR = 'INVESTIGADOR', 'Investigador'
	TURISTA = 'TURISTA', 'Turista'


class TipoAccion(models.TextChoices):
	CREACION = 'CREACION', 'Creacion'
	ACTUALIZACION = 'ACTUALIZACION', 'Actualizacion'
	ELIMINACION = 'ELIMINACION', 'Eliminacion'


class UsuarioManager(BaseUserManager):
	use_in_migrations = True

	def create_user(self, nickname, correo, nombre, apellido, clave=None, **extra_fields):
		if not nickname:
			raise ValueError('El nickname es obligatorio.')
		if not correo:
			raise ValueError('El correo es obligatorio.')

		correo = self.normalize_email(correo)
		usuario = self.model(
			nickname=nickname,
			correo=correo,
			nombre=nombre,
			apellido=apellido,
			**extra_fields,
		)
		if clave:
			usuario.set_password(clave)
		else:
			usuario.set_unusable_password()
		usuario.full_clean(exclude=['password'])
		usuario.save(using=self._db)
		return usuario

	def create_superuser(self, nickname, correo, nombre, apellido, clave=None, **extra_fields):
		extra_fields.setdefault('is_staff', True)
		extra_fields.setdefault('is_superuser', True)
		extra_fields.setdefault('is_active', True)
		extra_fields.setdefault('roles', [Rol.ADMINISTRADOR])

		if extra_fields.get('is_staff') is not True:
			raise ValueError('El superusuario debe tener is_staff=True.')
		if extra_fields.get('is_superuser') is not True:
			raise ValueError('El superusuario debe tener is_superuser=True.')

		return self.create_user(nickname, correo, nombre, apellido, clave=clave, **extra_fields)


class Persona(models.Model):
	nombre = models.CharField(max_length=120)
	apellido = models.CharField(max_length=120)
	correo = models.EmailField(unique=True)
	telefono = models.CharField(max_length=20, blank=True)

	class Meta:
		abstract = True


class Usuario(AbstractBaseUser, PermissionsMixin, Persona):
	nickname = models.CharField(max_length=150, unique=True)
	roles = models.JSONField(default=list, blank=True)
	is_active = models.BooleanField(default=True)
	is_staff = models.BooleanField(default=False)
	date_joined = models.DateTimeField(auto_now_add=True)

	objects = UsuarioManager()

	USERNAME_FIELD = 'nickname'
	REQUIRED_FIELDS = ['correo', 'nombre', 'apellido']

	class Meta:
		ordering = ['nickname']

	def clean(self):
		super().clean()
		self.roles = self._normalizar_roles(self.roles)
		if self.correo:
			self.correo = self.correo.lower()

	@staticmethod
	def _normalizar_roles(roles):
		roles = roles or []
		valores_validos = {rol.value for rol in Rol}
		normalizados = []
		for rol in roles:
			valor = rol.value if isinstance(rol, Rol) else str(rol)
			if valor not in valores_validos:
				raise ValidationError({'roles': f'Rol no valido: {valor}'})
			if valor not in normalizados:
				normalizados.append(valor)
		return normalizados

	@property
	def clave(self):
		return self.password

	@clave.setter
	def clave(self, value):
		self.password = value

	def set_clave(self, raw_password):
		self.set_password(raw_password)

	def tiene_rol(self, rol):
		valor = rol.value if isinstance(rol, Rol) else str(rol)
		return valor in (self.roles or [])

	def agregar_rol(self, rol):
		valor = rol.value if isinstance(rol, Rol) else str(rol)
		roles = list(self.roles or [])
		if valor not in roles:
			roles.append(valor)
			self.roles = roles
			self.full_clean(exclude=['password'])

	def quitar_rol(self, rol):
		valor = rol.value if isinstance(rol, Rol) else str(rol)
		self.roles = [actual for actual in (self.roles or []) if actual != valor]

	def get_full_name(self):
		return f'{self.nombre} {self.apellido}'.strip()

	def get_short_name(self):
		return self.nombre

	def __str__(self):
		return f'{self.nickname} ({self.correo})'


class Perfil(models.Model):
	usuario = models.OneToOneField(
		settings.AUTH_USER_MODEL,
		related_name='perfil',
		on_delete=models.CASCADE,
	)
	fecha_registro = models.DateField(auto_now_add=True)

	class Meta:
		ordering = ['-fecha_registro']

	@property
	def cantidad_visitas(self):
		return self.periodos_visita.count()

	@property
	def puntuacion(self):
		promedio = self.valoraciones.aggregate(promedio=Avg('puntuacion')).get('promedio')
		return float(promedio or 0)

	def __str__(self):
		return f'Perfil de {self.usuario.nickname}'


class Valoracion(models.Model):
	perfil = models.ForeignKey(Perfil, related_name='valoraciones', on_delete=models.CASCADE)
	atractivo_turistico = models.ForeignKey(
		'atractivos.AtractivoTuristico',
		related_name='valoraciones',
		on_delete=models.CASCADE,
	)
	puntuacion = models.PositiveSmallIntegerField()
	fecha_registro = models.DateField(auto_now_add=True)
	comentario = models.TextField(blank=True)

	def __str__(self):
		return f'Valoracion {self.puntuacion} de {self.perfil}'


class Favorito(models.Model):
	perfil = models.ForeignKey(Perfil, related_name='favoritos', on_delete=models.CASCADE)
	atractivo_turistico = models.ForeignKey(
		'atractivos.AtractivoTuristico',
		related_name='favoritos',
		on_delete=models.CASCADE,
	)
	fecha_guardado = models.DateField(auto_now_add=True)

	def __str__(self):
		return f'Favorito de {self.perfil}'


class PeriodoVisita(models.Model):
	perfil = models.ForeignKey(Perfil, related_name='periodos_visita', on_delete=models.CASCADE)
	fecha_inicio = models.DateField()
	fecha_fin = models.DateField()

	@property
	def duracion(self):
		if not self.fecha_inicio or not self.fecha_fin:
			return 0
		return max((self.fecha_fin - self.fecha_inicio).days, 0)

	def __str__(self):
		return f'Periodo {self.fecha_inicio} - {self.fecha_fin}'


class RegistroModificacion(models.Model):
	usuario = models.ForeignKey(
		settings.AUTH_USER_MODEL,
		related_name='registros_modificacion',
		on_delete=models.CASCADE,
	)
	atractivo_turistico = models.ForeignKey(
		'atractivos.AtractivoTuristico',
		related_name='registros_modificacion',
		on_delete=models.SET_NULL,
		null=True,
		blank=True,
	)
	tipo_accion = models.CharField(max_length=20, choices=TipoAccion.choices, default=TipoAccion.CREACION)
	fecha = models.DateField(auto_now_add=True)
	hora = models.TimeField(auto_now_add=True)
	descripcion = models.TextField()

	def __str__(self):
		return f'{self.tipo_accion} - {self.usuario.nickname}'
