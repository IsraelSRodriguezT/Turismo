from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.viewsets import ModelViewSet

from apps.atractivos.models import (
    AtractivoTuristico,
    Clasificacion,
    Gerente,
    Horario,
    Ruta,
    Servicio,
)
from apps.atractivos.serializers import (
    AtractivoTuristicoSerializer,
    ClasificacionSerializer,
    GerenteSerializer,
    HorarioSerializer,
    RutaSerializer,
    ServicioSerializer,
)


class AtractivoTuristicoViewSet(ModelViewSet):
    queryset = AtractivoTuristico.objects.all().select_related('gerente', 'ubicacion').prefetch_related(
        'clasificaciones', 'servicios', 'recomendaciones', 'horarios', 'rutas'
    )
    serializer_class = AtractivoTuristicoSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        queryset = super().get_queryset()
        request = self.request
        clasificacion = request.query_params.get('clasificacion')
        estado_conservacion = request.query_params.get('estado_conservacion')
        nivel_accesibilidad = request.query_params.get('nivel_accesibilidad')
        canton = request.query_params.get('canton')
        estado_publicacion = request.query_params.get('estado_publicacion')

        if clasificacion:
            queryset = queryset.filter(clasificaciones__id=clasificacion)
        if estado_conservacion:
            queryset = queryset.filter(estado_conservacion=estado_conservacion)
        if nivel_accesibilidad:
            queryset = queryset.filter(nivel_accesibilidad=nivel_accesibilidad)
        if canton:
            queryset = queryset.filter(ubicacion__canton__iexact=canton)
        if estado_publicacion:
            queryset = queryset.filter(estado_publicacion=estado_publicacion)
        return queryset.distinct()


class ClasificacionViewSet(ModelViewSet):
    queryset = Clasificacion.objects.all()
    serializer_class = ClasificacionSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


class ServicioViewSet(ModelViewSet):
    queryset = Servicio.objects.all()
    serializer_class = ServicioSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


class GerenteViewSet(ModelViewSet):
    queryset = Gerente.objects.all()
    serializer_class = GerenteSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


class HorarioViewSet(ModelViewSet):
    queryset = Horario.objects.all()
    serializer_class = HorarioSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]


class RutaViewSet(ModelViewSet):
    queryset = Ruta.objects.all()
    serializer_class = RutaSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
