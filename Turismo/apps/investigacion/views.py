from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action

from .models import ProyectoInvestigacion, Evidencia, Actor, PlanAccion, Impacto
from .serializers import (
    ProyectoInvestigacionSerializer,
    EvidenciaSerializer,
    ActorSerializer,
    PlanAccionSerializer,
    ImpactoSerializer,
)
from . import services


class ProyectoInvestigacionViewSet(viewsets.ModelViewSet):
    """ViewSet para gestión completa de proyectos de investigación."""
    queryset = ProyectoInvestigacion.objects.all().order_by("-created_at")
    serializer_class = ProyectoInvestigacionSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filterset_fields = ["estado", "responsable"]
    search_fields = ["titulo", "descripcion", "objetivo"]

    def get_queryset(self):
        filtros = self.request.query_params.dict()
        if filtros:
            return services.listar_proyectos(filtros).select_related("responsable").prefetch_related(
                "actores", "evidencias", "planes_accion", "impactos"
            )
        return (
            super()
            .get_queryset()
            .select_related("responsable")
            .prefetch_related("actores", "evidencias", "planes_accion", "impactos")
        )

    def perform_create(self, serializer):
        usuario = self.request.user if self.request.user.is_authenticated else None
        serializer.save(responsable=usuario)

    @action(detail=True, methods=["post"], url_path="actores")
    def add_actor(self, request, pk=None):
        proyecto = self.get_object()
        serializer = ActorSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        actor = services.agregar_actor(proyecto, serializer.validated_data)
        return Response(ActorSerializer(actor).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=["post"], url_path="evidencias")
    def add_evidencia(self, request, pk=None):
        proyecto = self.get_object()
        serializer = EvidenciaSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        evidencia = services.agregar_evidencia(proyecto, serializer.validated_data)
        return Response(EvidenciaSerializer(evidencia).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=["post"], url_path="planes-accion")
    def add_plan_accion(self, request, pk=None):
        proyecto = self.get_object()
        serializer = PlanAccionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        plan = services.agregar_plan_accion(proyecto, serializer.validated_data)
        return Response(PlanAccionSerializer(plan).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=["post"], url_path="impactos")
    def add_impacto(self, request, pk=None):
        proyecto = self.get_object()
        serializer = ImpactoSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        impacto = services.agregar_impacto(proyecto, serializer.validated_data)
        return Response(ImpactoSerializer(impacto).data, status=status.HTTP_201_CREATED)


class ActorViewSet(viewsets.ModelViewSet):
    queryset = Actor.objects.all()
    serializer_class = ActorSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class EvidenciaViewSet(viewsets.ModelViewSet):
    queryset = Evidencia.objects.all().order_by("-fechaRegistro")
    serializer_class = EvidenciaSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filterset_fields = ["proyecto", "tipoEvidencia"]


class PlanAccionViewSet(viewsets.ModelViewSet):
    queryset = PlanAccion.objects.all().order_by("-fechaInicio")
    serializer_class = PlanAccionSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filterset_fields = ["proyecto", "estado"]


class ImpactoViewSet(viewsets.ModelViewSet):
    queryset = Impacto.objects.all().order_by("-nivelImpacto")
    serializer_class = ImpactoSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filterset_fields = ["proyecto"]
