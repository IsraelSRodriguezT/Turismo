from django.urls import include, path
from rest_framework.routers import DefaultRouter

from apps.atractivos.views import AtractivoTuristicoViewSet, ClasificacionViewSet, GerenteViewSet, HorarioViewSet, RutaViewSet, ServicioViewSet

app_name = 'atractivos'

router = DefaultRouter()
router.register('atractivos', AtractivoTuristicoViewSet, basename='atractivo')
router.register('clasificaciones', ClasificacionViewSet, basename='clasificacion')
router.register('servicios', ServicioViewSet, basename='servicio')
router.register('gerentes', GerenteViewSet, basename='gerente')
router.register('horarios', HorarioViewSet, basename='horario')
router.register('rutas', RutaViewSet, basename='ruta')

urlpatterns = [
    path('', include(router.urls)),
]
