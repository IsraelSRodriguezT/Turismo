from rest_framework import serializers

from apps.atractivos.models import (
    AtractivoTuristico,
    Clasificacion,
    DetalleRuta,
    Direccion,
    Gerente,
    Horario,
    InformacionClimatica,
    Recomendacion,
    Ruta,
    Servicio,
    Ubicacion,
)
from apps.atractivos.services import AtractivoService


class ClasificacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Clasificacion
        fields = '__all__'


class ServicioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Servicio
        fields = '__all__'


class GerenteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Gerente
        fields = '__all__'


class HorarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Horario
        fields = '__all__'


class RecomendacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recomendacion
        fields = '__all__'


class RutaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ruta
        fields = '__all__'


class DireccionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Direccion
        fields = [
            'calle_principal',
            'calle_transversal',
            'numero',
            'referencia',
        ]


class InformacionClimaticaSerializer(serializers.ModelSerializer):
    class Meta:
        model = InformacionClimatica
        fields = [
            'clima',
            'temperatura_minima',
            'temperatura_maxima',
            'temperatura_actual',
            'precipitacion_minima',
            'precipitacion_maxima',
        ]


class UbicacionSerializer(serializers.ModelSerializer):
    direccion = DireccionSerializer(required=False, allow_null=True)
    informacion_climatica = InformacionClimaticaSerializer(required=False, allow_null=True)

    class Meta:
        model = Ubicacion
        fields = [
            'latitud',
            'longitud',
            'altitud',
            'canton',
            'direccion',
            'informacion_climatica',
        ]


class AtractivoTuristicoSerializer(serializers.ModelSerializer):
    clasificaciones = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Clasificacion.objects.all(),
        required=False,
    )
    servicios = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Servicio.objects.all(),
        required=False,
    )
    recomendaciones = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Recomendacion.objects.all(),
        required=False,
    )
    horarios = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Horario.objects.all(),
        required=False,
    )
    rutas = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Ruta.objects.all(),
        required=False,
    )
    gerente = serializers.PrimaryKeyRelatedField(
        queryset=Gerente.objects.all(),
        required=False,
        allow_null=True,
    )
    ubicacion = UbicacionSerializer(required=False, allow_null=True)

    class Meta:
        model = AtractivoTuristico
        fields = [
            'id',
            'nombre',
            'descripcion',
            'nivel_clasificacion',
            'nivel_accesibilidad',
            'estado_conservacion',
            'estado_publicacion',
            'gerente',
            'clasificaciones',
            'servicios',
            'recomendaciones',
            'horarios',
            'rutas',
            'ubicacion',
            'fecha_creacion',
            'fecha_actualizacion',
        ]

    def create(self, validated_data):
        return AtractivoService.create_atractivo(validated_data)

    def update(self, instance, validated_data):
        return AtractivoService.update_atractivo(instance, validated_data)
