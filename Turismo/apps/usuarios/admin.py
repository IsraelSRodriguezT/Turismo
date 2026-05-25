from django.contrib import admin

from apps.usuarios.models import Favorito, PeriodoVisita, Perfil, RegistroModificacion, Usuario, Valoracion


@admin.register(Usuario)
class UsuarioAdmin(admin.ModelAdmin):
	list_display = ('nickname', 'correo', 'nombre', 'apellido', 'is_staff', 'is_active')
	search_fields = ('nickname', 'correo', 'nombre', 'apellido')
	list_filter = ('is_staff', 'is_active', 'roles')
	readonly_fields = ('last_login', 'date_joined')
	filter_horizontal = ('groups', 'user_permissions')

	fieldsets = (
		('Identidad', {
			'fields': ('nickname', 'correo', 'nombre', 'apellido', 'telefono', 'roles', 'password'),
		}),
		('Permisos', {
			'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'),
		}),
		('Fechas', {
			'fields': ('last_login', 'date_joined'),
		}),
	)

	def save_model(self, request, obj, form, change):
		if obj.password and not obj.password.startswith('pbkdf2_'):
			obj.set_password(obj.password)
		super().save_model(request, obj, form, change)


@admin.register(Perfil)
class PerfilAdmin(admin.ModelAdmin):
	list_display = ('usuario', 'fecha_registro')
	search_fields = ('usuario__nickname', 'usuario__correo')


@admin.register(Valoracion)
class ValoracionAdmin(admin.ModelAdmin):
	list_display = ('perfil', 'atractivo_turistico', 'puntuacion', 'fecha_registro')
	search_fields = ('perfil__usuario__nickname', 'comentario')


@admin.register(Favorito)
class FavoritoAdmin(admin.ModelAdmin):
	list_display = ('perfil', 'atractivo_turistico', 'fecha_guardado')
	search_fields = ('perfil__usuario__nickname',)


@admin.register(PeriodoVisita)
class PeriodoVisitaAdmin(admin.ModelAdmin):
	list_display = ('perfil', 'fecha_inicio', 'fecha_fin')
	search_fields = ('perfil__usuario__nickname',)


@admin.register(RegistroModificacion)
class RegistroModificacionAdmin(admin.ModelAdmin):
	list_display = ('usuario', 'accion', 'fecha', 'hora', 'atractivo_turistico')
	list_filter = ('accion', 'fecha')
	search_fields = ('usuario__nickname', 'descripcion')
