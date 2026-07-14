from rest_framework import serializers
from .models import Publicacion, Recurso
from apps.atractivos.models import AtractivoTuristico, Ruta

class RecursoSerializer(serializers.ModelSerializer):
	tipo_recurso_display = serializers.CharField(source='get_tipo_recurso_display', read_only=True)
	atractivo_turistico = serializers.PrimaryKeyRelatedField(queryset=AtractivoTuristico.objects.all())

	class Meta:
		model = Recurso
		fields = ('id', 'atractivo_turistico', 'titulo', 'descripcion', 'url', 'archivo', 'fecha_subida', 'tipo_recurso', 'tipo_recurso_display')
		read_only_fields = ('id', 'fecha_subida', 'tipo_recurso_display')

class PublicacionSerializer(serializers.ModelSerializer):
	tipo_display = serializers.CharField(source='get_tipo_display', read_only=True)
	canton_nombre = serializers.CharField(source='canton.nombre', read_only=True, default=None)
	ruta_nombre = serializers.CharField(source='ruta.nombre', read_only=True, default=None)
	atractivo_nombre = serializers.CharField(source='atractivo_turistico.nombre', read_only=True, default=None)

	class Meta:
		model = Publicacion
		fields = '__all__'
		read_only_fields = ('id', 'fecha_publicacion', 'tipo_display', 'canton_nombre', 'ruta_nombre', 'atractivo_nombre')
