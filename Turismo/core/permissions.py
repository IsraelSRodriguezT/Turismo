from rest_framework.permissions import BasePermission, SAFE_METHODS

from apps.usuarios.models import Rol


class _EsRol(BasePermission):
	rol_requerido = None

	def has_permission(self, request, view):
		usuario = getattr(request, 'user', None)
		if not usuario or not usuario.is_authenticated or self.rol_requerido is None:
			return False
		return usuario.tiene_rol(self.rol_requerido)


class EsAdmin(_EsRol):
	rol_requerido = Rol.ADMINISTRADOR


class EsGestorTerritorial(_EsRol):
	rol_requerido = Rol.GESTOR_TERRITORIAL


class EsGestorTuristico(_EsRol):
	rol_requerido = Rol.GESTOR_TURISTICO


class EsInvestigador(_EsRol):
	rol_requerido = Rol.INVESTIGADOR


class EsTurista(_EsRol):
	rol_requerido = Rol.TURISTA


class EsOwnerOAdmin(BasePermission):
	def has_permission(self, request, view):
		return bool(request.user and request.user.is_authenticated)

	def has_object_permission(self, request, view, obj):
		usuario = request.user
		if not usuario or not usuario.is_authenticated:
			return False
		if usuario.tiene_rol(Rol.ADMINISTRADOR):
			return True
		propietario = getattr(obj, 'usuario', obj)
		return propietario == usuario


class EsAdminOPropietario(EsOwnerOAdmin):
	pass


class LecturaSolo(BasePermission):
	def has_permission(self, request, view):
		return request.method in SAFE_METHODS
