from rest_framework import viewsets
from .models import Mapa, Pais, Provincia, Canton, Parroquia, Sector
from .serializers import (
    MapaSerializer, PaisSerializer, ProvinciaSerializer,
    CantonSerializer, ParroquiaSerializer, SectorSerializer,
    JerarquiaGeograficaSerializer
)
from .services import GeolocalizacionService

class MapaViewSet(viewsets.ModelViewSet):
    queryset = Mapa.objects.all()
    serializer_class = MapaSerializer

class PaisViewSet(viewsets.ModelViewSet):
    queryset = Pais.objects.all()
    serializer_class = PaisSerializer

class ProvinciaViewSet(viewsets.ModelViewSet):
    queryset = Provincia.objects.all()
    serializer_class = ProvinciaSerializer

    def get_queryset(self):
        queryset = Provincia.objects.all()
        pais_id = self.request.query_params.get('pais', None)
        if pais_id is not None:
            queryset = queryset.filter(pais_id=pais_id)
        return queryset

class CantonViewSet(viewsets.ModelViewSet):
    queryset = Canton.objects.all()
    serializer_class = CantonSerializer

    def get_queryset(self):
        queryset = Canton.objects.all()
        provincia_id = self.request.query_params.get('provincia', None)
        if provincia_id is not None:
            queryset = queryset.filter(provincia_id=provincia_id)
        return queryset

class ParroquiaViewSet(viewsets.ModelViewSet):
    queryset = Parroquia.objects.all()
    serializer_class = ParroquiaSerializer

    def get_queryset(self):
        queryset = Parroquia.objects.all()
        canton_id = self.request.query_params.get('canton', None)
        if canton_id is not None:
            queryset = queryset.filter(canton_id=canton_id)
        return queryset

class SectorViewSet(viewsets.ModelViewSet):
    queryset = Sector.objects.all()
    serializer_class = SectorSerializer

    def get_queryset(self):
        queryset = Sector.objects.all()
        parroquia_id = self.request.query_params.get('parroquia', None)
        if parroquia_id is not None:
            queryset = queryset.filter(parroquia_id=parroquia_id)
        return queryset

class JerarquiaGeograficaViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = GeolocalizacionService.obtener_jerarquia_geografica()
    serializer_class = JerarquiaGeograficaSerializer
