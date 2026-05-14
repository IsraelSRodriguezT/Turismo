from rest_framework import serializers
from .models import Mapa, Pais, Provincia, Canton, Parroquia, Sector

class MapaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mapa
        fields = '__all__'

class PaisSerializer(serializers.ModelSerializer):
    class Meta:
        model = Pais
        fields = '__all__'

class ProvinciaSerializer(serializers.ModelSerializer):
    pais = PaisSerializer(read_only=True)
    pais_id = serializers.PrimaryKeyRelatedField(
        queryset=Pais.objects.all(), source='pais', write_only=True
    )

    class Meta:
        model = Provincia
        fields = '__all__'

class CantonSerializer(serializers.ModelSerializer):
    provincia = ProvinciaSerializer(read_only=True)
    provincia_id = serializers.PrimaryKeyRelatedField(
        queryset=Provincia.objects.all(), source='provincia', write_only=True
    )

    class Meta:
        model = Canton
        fields = '__all__'

class ParroquiaSerializer(serializers.ModelSerializer):
    canton = CantonSerializer(read_only=True)
    canton_id = serializers.PrimaryKeyRelatedField(
        queryset=Canton.objects.all(), source='canton', write_only=True
    )

    class Meta:
        model = Parroquia
        fields = '__all__'

class SectorSerializer(serializers.ModelSerializer):
    parroquia = ParroquiaSerializer(read_only=True)
    parroquia_id = serializers.PrimaryKeyRelatedField(
        queryset=Parroquia.objects.all(), source='parroquia', write_only=True
    )

    class Meta:
        model = Sector
        fields = '__all__'

class JerarquiaGeograficaSerializer(serializers.ModelSerializer):
    provincias = ProvinciaSerializer(many=True, read_only=True)

    class Meta:
        model = Pais
        fields = ('id', 'nombre', 'provincias')