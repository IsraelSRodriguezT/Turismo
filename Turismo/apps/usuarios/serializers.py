from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

from apps.usuarios.models import Favorito, Perfil, Rol, Valoracion, Usuario
from apps.usuarios.services import UsuarioService


class UsuarioSerializer(serializers.ModelSerializer):
	class Meta:
		model = Usuario
		fields = (
			'id',
			'nickname',
			'correo',
			'nombre',
			'apellido',
			'telefono',
			'roles',
		)
		read_only_fields = ('id', 'roles')


class UsuarioAdminSerializer(serializers.ModelSerializer):
	clave = serializers.CharField(write_only=True, required=False, allow_blank=False, trim_whitespace=False)

	class Meta:
		model = Usuario
		fields = (
			'id',
			'nickname',
			'correo',
			'nombre',
			'apellido',
			'telefono',
			'roles',
			'is_active',
			'is_staff',
			'clave',
		)
		read_only_fields = ('id',)

	def validate_roles(self, value):
		valores_validos = {rol.value for rol in Rol}
		normalizados = []
		for rol in value or []:
			valor = rol.value if isinstance(rol, Rol) else str(rol)
			if valor not in valores_validos:
				raise serializers.ValidationError(f'Rol no valido: {valor}')
			if valor not in normalizados:
				normalizados.append(valor)
		return normalizados

	def update(self, instance, validated_data):
		clave = validated_data.pop('clave', None)
		for field, value in validated_data.items():
			setattr(instance, field, value)
		if clave:
			validate_password(clave, user=instance)
			instance.set_password(clave)
		instance.full_clean(exclude=['password'])
		instance.save()
		return instance


class RegistroSerializer(serializers.Serializer):
	nickname = serializers.CharField(max_length=150)
	correo = serializers.EmailField()
	nombre = serializers.CharField(max_length=120)
	apellido = serializers.CharField(max_length=120)
	telefono = serializers.CharField(max_length=20, required=False, allow_blank=True)
	clave = serializers.CharField(write_only=True, trim_whitespace=False)
	clave_confirmacion = serializers.CharField(write_only=True, trim_whitespace=False)

	def validate_correo(self, value):
		if Usuario.objects.filter(correo__iexact=value).exists():
			raise serializers.ValidationError('Ya existe un usuario con este correo.')
		return value

	def validate_nickname(self, value):
		if Usuario.objects.filter(nickname__iexact=value).exists():
			raise serializers.ValidationError('Ya existe un usuario con este nickname.')
		return value

	def validate(self, attrs):
		if attrs['clave'] != attrs['clave_confirmacion']:
			raise serializers.ValidationError({'clave_confirmacion': 'Las claves no coinciden.'})
		validate_password(attrs['clave'])
		return attrs

	def create(self, validated_data):
		validated_data.pop('clave_confirmacion')
		clave = validated_data.pop('clave')
		usuario = UsuarioService.crear_usuario(clave=clave, roles=None, **validated_data)
		return usuario


class LoginSerializer(serializers.Serializer):
	nickname = serializers.CharField()
	clave = serializers.CharField(write_only=True, trim_whitespace=False)


class CambioClaveSerializer(serializers.Serializer):
	clave_actual = serializers.CharField(write_only=True, trim_whitespace=False)
	clave_nueva = serializers.CharField(write_only=True, trim_whitespace=False)
	clave_nueva_confirmacion = serializers.CharField(write_only=True, trim_whitespace=False)

	def validate(self, attrs):
		if attrs['clave_nueva'] != attrs['clave_nueva_confirmacion']:
			raise serializers.ValidationError({'clave_nueva_confirmacion': 'Las claves no coinciden.'})
		validate_password(attrs['clave_nueva'])
		return attrs


class PerfilSerializer(serializers.ModelSerializer):
	nickname = serializers.CharField(source='usuario.nickname', required=False)
	correo = serializers.EmailField(source='usuario.correo', required=False)
	nombre = serializers.CharField(source='usuario.nombre', required=False)
	apellido = serializers.CharField(source='usuario.apellido', required=False)
	telefono = serializers.CharField(source='usuario.telefono', required=False, allow_blank=True)
	cantidad_visitas = serializers.IntegerField(read_only=True)
	puntuacion = serializers.FloatField(read_only=True)

	class Meta:
		model = Perfil
		fields = (
			'id',
			'nickname',
			'correo',
			'nombre',
			'apellido',
			'telefono',
			'fecha_registro',
			'cantidad_visitas',
			'puntuacion',
		)
		read_only_fields = ('id', 'fecha_registro', 'cantidad_visitas', 'puntuacion')

	def update(self, instance, validated_data):
		usuario_data = validated_data.pop('usuario', {})
		usuario = instance.usuario
		for field, value in usuario_data.items():
			setattr(usuario, field, value)
		usuario.full_clean(exclude=['password'])
		usuario.save()
		return instance


class ValoracionSerializer(serializers.ModelSerializer):
	class Meta:
		model = Valoracion
		fields = ('id', 'perfil', 'atractivo_turistico', 'puntuacion', 'fecha_registro', 'comentario')
		read_only_fields = ('id', 'perfil', 'fecha_registro')


class FavoritoSerializer(serializers.ModelSerializer):
	class Meta:
		model = Favorito
		fields = ('id', 'perfil', 'atractivo_turistico', 'fecha_guardado')
		read_only_fields = ('id', 'perfil', 'fecha_guardado')
