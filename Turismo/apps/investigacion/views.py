from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from drf_spectacular.utils import OpenApiParameter, extend_schema, extend_schema_view

from .models import ProyectoInvestigacion, Evidencia, Actor, PlanAccion, Impacto
from .serializers import ProyectoInvestigacionSerializer, EvidenciaSerializer, ActorSerializer, PlanAccionSerializer, ImpactoSerializer
from . import services
from core.api import NormalizedModelViewSet

@extend_schema_view(
    list=extend_schema(
        parameters=[
            OpenApiParameter(
                name='q',
                type=str,
                location=OpenApiParameter.QUERY,
                required=False,
                description='Busca por título, descripción u objetivo.',
            ),
            OpenApiParameter(
                name='fecha_inicio_gte',
                type=str,
                location=OpenApiParameter.QUERY,
                required=False,
                description='Filtra proyectos con fecha_inicio mayor o igual al valor enviado (YYYY-MM-DD).',
            ),
            OpenApiParameter(
                name='fecha_fin_lte',
                type=str,
                location=OpenApiParameter.QUERY,
                required=False,
                description='Filtra proyectos con fecha_fin menor o igual al valor enviado (YYYY-MM-DD).',
            ),
        ]
    )
)

class ProyectoInvestigacionViewSet(NormalizedModelViewSet):
    queryset = ProyectoInvestigacion.objects.all().order_by("-fecha_inicio")
    serializer_class = ProyectoInvestigacionSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filterset_fields = ["sector"]
    search_fields = ["titulo", "descripcion", "objetivo"]

    def get_queryset(self):
        filtros = self.request.query_params.dict()
        if filtros:
            return services.listar_proyectos(filtros).prefetch_related(
                "actores", "evidencias", "planes_accion", "impactos"
            )
        return (
            super()
            .get_queryset()
            .prefetch_related("actores", "evidencias", "planes_accion", "impactos")
        )

    def perform_create(self, serializer):
        serializer.save()

    @extend_schema(request=ActorSerializer, responses={201: ActorSerializer})
    @action(detail=True, methods=["post"], url_path="actores")
    def add_actor(self, request, pk=None):
        proyecto = self.get_object()
        serializer = ActorSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        actor = services.agregar_actor(proyecto, serializer.validated_data)
        return Response(ActorSerializer(actor).data, status=status.HTTP_201_CREATED)

    @extend_schema(request=EvidenciaSerializer, responses={201: EvidenciaSerializer})
    @action(detail=True, methods=["post"], url_path="evidencias")
    def add_evidencia(self, request, pk=None):
        proyecto = self.get_object()
        serializer = EvidenciaSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        evidencia = services.agregar_evidencia(proyecto, serializer.validated_data)
        return Response(EvidenciaSerializer(evidencia).data, status=status.HTTP_201_CREATED)

    @extend_schema(request=PlanAccionSerializer, responses={201: PlanAccionSerializer})
    @action(detail=True, methods=["post"], url_path="planes-accion")
    def add_plan_accion(self, request, pk=None):
        proyecto = self.get_object()
        serializer = PlanAccionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        plan = services.agregar_plan_accion(proyecto, serializer.validated_data)
        return Response(PlanAccionSerializer(plan).data, status=status.HTTP_201_CREATED)

    @extend_schema(request=ImpactoSerializer, responses={201: ImpactoSerializer})
    @action(detail=True, methods=["post"], url_path="impactos")
    def add_impacto(self, request, pk=None):
        proyecto = self.get_object()
        serializer = ImpactoSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        impacto = services.agregar_impacto(proyecto, serializer.validated_data)
        return Response(ImpactoSerializer(impacto).data, status=status.HTTP_201_CREATED)

class ActorViewSet(NormalizedModelViewSet):
    queryset = Actor.objects.all()
    serializer_class = ActorSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class EvidenciaViewSet(NormalizedModelViewSet):
    queryset = Evidencia.objects.all().order_by("-fecha_registro")
    serializer_class = EvidenciaSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filterset_fields = ["proyecto", "tipo_evidencia"]

class PlanAccionViewSet(NormalizedModelViewSet):
    queryset = PlanAccion.objects.all().order_by("-fecha_inicio")
    serializer_class = PlanAccionSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filterset_fields = ["proyecto"]

class ImpactoViewSet(NormalizedModelViewSet):
    queryset = Impacto.objects.all().order_by("-nivel_impacto")
    serializer_class = ImpactoSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filterset_fields = ["proyecto"]
