from django.contrib.auth import authenticate

from apps.usuarios.models import Perfil, RegistroModificacion, Rol, TipoAccion, Usuario


class UsuarioService:
	@staticmethod
	def crear_usuario(*, nickname, correo, nombre, apellido, clave, roles=None, **extra_fields):
		usuario = Usuario.objects.create_user(
			nickname=nickname,
			correo=correo,
			nombre=nombre,
			apellido=apellido,
			clave=clave,
			roles=roles or [Rol.TURISTA],
			**extra_fields,
		)
		Perfil.objects.get_or_create(usuario=usuario)
		return usuario

	@staticmethod
	def autenticar(nickname, clave):
		return authenticate(username=nickname, password=clave)

	@staticmethod
	def cambiar_clave(usuario, clave_actual, clave_nueva):
		if not usuario.check_password(clave_actual):
			raise ValueError('La clave actual no coincide.')
		usuario.set_password(clave_nueva)
		usuario.save(update_fields=['password'])
		return usuario

	@staticmethod
	def asegurar_perfil(usuario):
		perfil, _ = Perfil.objects.get_or_create(usuario=usuario)
		return perfil

	@staticmethod
	def registrar_modificacion(usuario, descripcion, atractivo_turistico=None, tipo_accion=TipoAccion.CREACION):
		return RegistroModificacion.objects.create(
			usuario=usuario,
			descripcion=descripcion,
			atractivo_turistico=atractivo_turistico,
			tipo_accion=tipo_accion,
		)


class PermisoService:
	@staticmethod
	def tiene_rol(usuario, rol):
		return bool(usuario and usuario.is_authenticated and usuario.tiene_rol(rol))

	@staticmethod
	def es_admin(usuario):
		return PermisoService.tiene_rol(usuario, Rol.ADMINISTRADOR)

	@staticmethod
	def es_propietario(usuario, perfil):
		if not usuario or not usuario.is_authenticated:
			return False
		return getattr(perfil, 'usuario_id', None) == usuario.id
