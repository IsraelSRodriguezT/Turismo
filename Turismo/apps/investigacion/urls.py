from rest_framework import routers
from .views import ProyectoInvestigacionViewSet, ActorViewSet, EvidenciaViewSet, PlanAccionViewSet, ImpactoViewSet

router = routers.DefaultRouter()
router.register(r"proyectos", ProyectoInvestigacionViewSet, basename="investigacion-proyecto")
router.register(r"actores", ActorViewSet, basename="investigacion-actor")
router.register(r"evidencias", EvidenciaViewSet, basename="investigacion-evidencia")
router.register(r"planes-accion", PlanAccionViewSet, basename="investigacion-plan")
router.register(r"impactos", ImpactoViewSet, basename="investigacion-impacto")

urlpatterns = router.urls
