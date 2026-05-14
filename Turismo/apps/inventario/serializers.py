from rest_framework import serializers

from .models import Recurso


class RecursoSerializer(serializers.ModelSerializer):
	tipo_recurso_display = serializers.CharField(source='get_tipo_recurso_display', read_only=True)

	class Meta:
		model = Recurso
		fields = (
			'id',
			'titulo',
			'descripcion',
			'url',
			'fecha_subida',
			'tipo_recurso',
			'tipo_recurso_display',
		)
		read_only_fields = ('id', 'fecha_subida', 'tipo_recurso_display')
