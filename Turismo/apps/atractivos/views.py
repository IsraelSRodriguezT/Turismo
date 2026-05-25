from rest_framework.permissions import IsAuthenticatedOrReadOnly
from drf_spectacular.utils import OpenApiParameter, extend_schema, extend_schema_view

from apps.atractivos.models import AtractivoTuristico, Clasificacion, Gerente, Horario, Ruta, Servicio
from apps.atractivos.serializers import AtractivoTuristicoSerializer, ClasificacionSerializer, GerenteSerializer, HorarioSerializer, RutaSerializer, ServicioSerializer
from core.api import NormalizedModelViewSet

@extend_schema_view(
    list=extend_schema(
        parameters=[
            OpenApiParameter(
                name='clasificacion',
                type=str,
                location=OpenApiParameter.QUERY,
                required=False,
                description='Filtra atractivos por la clasificación asociada.',
            ),
            OpenApiParameter(
                name='estado_conservacion',
                type=str,
                location=OpenApiParameter.QUERY,
                required=False,
                description='Filtra atractivos por su estado de conservación.',
            ),
            OpenApiParameter(
                name='nivel_accesibilidad',
                type=str,
                location=OpenApiParameter.QUERY,
                required=False,
                description='Filtra atractivos por su nivel de accesibilidad.',
            ),
        ]
    )
)

class AtractivoTuristicoViewSet(NormalizedModelViewSet):
    queryset = AtractivoTuristico.objects.all().select_related('gerente', 'ubicacion').prefetch_related(
        'clasificaciones', 'servicios', 'recomendaciones', 'horarios', 'detalles_ruta__ruta'
    )
    serializer_class = AtractivoTuristicoSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        queryset = super().get_queryset()
        request = self.request
        clasificacion = request.query_params.get('clasificacion')
        estado_conservacion = request.query_params.get('estado_conservacion')
        nivel_accesibilidad = request.query_params.get('nivel_accesibilidad')

        if clasificacion:
            queryset = queryset.filter(clasificaciones__id=clasificacion)
        if estado_conservacion:
            queryset = queryset.filter(estado_conservacion=estado_conservacion)
        if nivel_accesibilidad:
            queryset = queryset.filter(nivel_accesibilidad=nivel_accesibilidad)
        return queryset.distinct()

class ClasificacionViewSet(NormalizedModelViewSet):
    queryset = Clasificacion.objects.all()
    serializer_class = ClasificacionSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class ServicioViewSet(NormalizedModelViewSet):
    queryset = Servicio.objects.all()
    serializer_class = ServicioSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class GerenteViewSet(NormalizedModelViewSet):
    queryset = Gerente.objects.all()
    serializer_class = GerenteSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class HorarioViewSet(NormalizedModelViewSet):
    queryset = Horario.objects.all()
    serializer_class = HorarioSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class RutaViewSet(NormalizedModelViewSet):
    queryset = Ruta.objects.all()
    serializer_class = RutaSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
