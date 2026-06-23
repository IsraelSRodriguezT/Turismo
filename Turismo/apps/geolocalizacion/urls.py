from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import EnlaceExternoViewSet, MapaViewSet, PaisViewSet, ProvinciaViewSet, CantonViewSet, ParroquiaViewSet, SectorViewSet, JerarquiaGeograficaViewSet

router = DefaultRouter()
router.register(r'mapas', MapaViewSet)
router.register(r'paises', PaisViewSet)
router.register(r'provincias', ProvinciaViewSet)
router.register(r'cantones', CantonViewSet)
router.register(r'parroquias', ParroquiaViewSet)
router.register(r'sectores', SectorViewSet)
router.register(r'jerarquia', JerarquiaGeograficaViewSet, basename='jerarquia')
router.register(r'enlaces-externos', EnlaceExternoViewSet, basename='enlace-externo')

urlpatterns = [
    path('', include(router.urls)),
]