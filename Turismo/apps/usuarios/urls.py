from django.urls import include, path
from rest_framework.routers import DefaultRouter

from apps.usuarios.views import (
    CambioClaveAPIView,
    LoginAPIView,
    PerfilFavoritoAPIView,
    PerfilFavoritoDetalleAPIView,
    PerfilValoracionAPIView,
    PerfilValoracionDetalleAPIView,
    PerfilViewSet,
    RefreshTokenAPIView,
    RegistroAPIView,
    UsuarioAdminViewSet,
)

app_name = 'usuarios'

router = DefaultRouter()
router.register('perfiles', PerfilViewSet, basename='perfil')
router.register('usuarios-admin', UsuarioAdminViewSet, basename='usuario-admin')

urlpatterns = [
    path('', include(router.urls)),
    path('registro/', RegistroAPIView.as_view(), name='registro'),
    path('login/', LoginAPIView.as_view(), name='login'),
    path('refresh-token/', RefreshTokenAPIView.as_view(), name='refresh-token'),
    path('cambiar-contrasena/', CambioClaveAPIView.as_view(), name='cambiar-contrasena'),
    path('perfiles/<int:perfil_pk>/valoraciones/', PerfilValoracionAPIView.as_view(), name='perfil-valoraciones'),
    path('perfiles/<int:perfil_pk>/valoraciones/<int:valoracion_pk>/', PerfilValoracionDetalleAPIView.as_view(), name='perfil-valoracion-detail'),
    path('perfiles/<int:perfil_pk>/favoritos/', PerfilFavoritoAPIView.as_view(), name='perfil-favoritos'),
    path('perfiles/<int:perfil_pk>/favoritos/<int:favorito_pk>/', PerfilFavoritoDetalleAPIView.as_view(), name='perfil-favorito-detail'),
]