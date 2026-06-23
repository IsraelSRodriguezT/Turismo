from rest_framework import viewsets
from drf_spectacular.utils import OpenApiParameter, extend_schema, extend_schema_view
from .models import EnlaceExterno, Mapa, Pais, Provincia, Canton, Parroquia, Sector
from .serializers import EnlaceExternoSerializer, MapaSerializer, PaisSerializer, ProvinciaSerializer, CantonSerializer, ParroquiaSerializer, SectorSerializer, JerarquiaGeograficaSerializer
from .services import GeolocalizacionService
from core.api import NormalizedModelViewSet, NormalizedReadOnlyModelViewSet

class MapaViewSet(NormalizedModelViewSet):
    queryset = Mapa.objects.all()
    serializer_class = MapaSerializer

class PaisViewSet(NormalizedModelViewSet):
    queryset = Pais.objects.all()
    serializer_class = PaisSerializer

@extend_schema_view(
    list=extend_schema(
        parameters=[
            OpenApiParameter(
                name='pais',
                type=int,
                location=OpenApiParameter.QUERY,
                required=False,
                description='Filtra provincias por país.',
            )
        ]
    )
)

class ProvinciaViewSet(NormalizedModelViewSet):
    queryset = Provincia.objects.all()
    serializer_class = ProvinciaSerializer

    def get_queryset(self):
        queryset = Provincia.objects.all()
        pais_id = self.request.query_params.get('pais', None)
        if pais_id is not None:
            queryset = queryset.filter(pais_id=pais_id)
        return queryset

@extend_schema_view(
    list=extend_schema(
        parameters=[
            OpenApiParameter(
                name='provincia',
                type=int,
                location=OpenApiParameter.QUERY,
                required=False,
                description='Filtra cantones por provincia.',
            )
        ]
    )
)

class CantonViewSet(NormalizedModelViewSet):
    queryset = Canton.objects.all()
    serializer_class = CantonSerializer

    def get_queryset(self):
        queryset = Canton.objects.all()
        provincia_id = self.request.query_params.get('provincia', None)
        if provincia_id is not None:
            queryset = queryset.filter(provincia_id=provincia_id)
        return queryset

@extend_schema_view(
    list=extend_schema(
        parameters=[
            OpenApiParameter(
                name='canton',
                type=int,
                location=OpenApiParameter.QUERY,
                required=False,
                description='Filtra parroquias por cantón.',
            )
        ]
    )
)

class ParroquiaViewSet(NormalizedModelViewSet):
    queryset = Parroquia.objects.all()
    serializer_class = ParroquiaSerializer

    def get_queryset(self):
        queryset = Parroquia.objects.all()
        canton_id = self.request.query_params.get('canton', None)
        if canton_id is not None:
            queryset = queryset.filter(canton_id=canton_id)
        return queryset

@extend_schema_view(
    list=extend_schema(
        parameters=[
            OpenApiParameter(
                name='parroquia',
                type=int,
                location=OpenApiParameter.QUERY,
                required=False,
                description='Filtra sectores por parroquia.',
            )
        ]
    )
)

class SectorViewSet(NormalizedModelViewSet):
    queryset = Sector.objects.all()
    serializer_class = SectorSerializer

    def get_queryset(self):
        queryset = Sector.objects.all()
        parroquia_id = self.request.query_params.get('parroquia', None)
        if parroquia_id is not None:
            queryset = queryset.filter(parroquia_id=parroquia_id)
        return queryset

class JerarquiaGeograficaViewSet(NormalizedReadOnlyModelViewSet):
    queryset = GeolocalizacionService.obtener_jerarquia_geografica()
    serializer_class = JerarquiaGeograficaSerializer

class EnlaceExternoViewSet(NormalizedModelViewSet):
    queryset = EnlaceExterno.objects.all()
    serializer_class = EnlaceExternoSerializer
    filterset_fields = ['tipo', 'canton', 'atractivo_turistico', 'ruta', 'activo']
    search_fields = ['nombre', 'descripcion']
