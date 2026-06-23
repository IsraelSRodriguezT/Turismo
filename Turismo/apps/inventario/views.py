from rest_framework import viewsets, parsers, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import serializers as drf_serializers
from drf_spectacular.utils import extend_schema, inline_serializer

from django.core.exceptions import ValidationError as DjangoValidationError

from .models import Publicacion, Recurso
from .serializers import PublicacionSerializer, RecursoSerializer
from .services import validar_estructura_archivo, importar_desde_excel
from core.api import NormalizedModelViewSet

class RecursoViewSet(NormalizedModelViewSet):
    queryset = Recurso.objects.select_related('atractivo_turistico').all()
    serializer_class = RecursoSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        sin_atractivo = self.request.query_params.get('sin_atractivo')
        if sin_atractivo and sin_atractivo.lower() in ('true', '1'):
            qs = qs.filter(atractivo_turistico__isnull=True)
        return qs

    @extend_schema(
        request=inline_serializer(
            name='ImportarRecursoRequest',
            fields={
                'file': drf_serializers.FileField(required=False),
                'archivo': drf_serializers.FileField(required=False),
            },
        ),
        description='Importa recursos desde un archivo CSV o XLSX enviado como multipart/form-data.',
    )
    
    @action(detail=False, methods=['post'], url_path='importar', parser_classes=[parsers.MultiPartParser])
    def importar(self, request):
        """Endpoint para subir un archivo CSV/XLSX y crear recursos."""
        uploaded = request.FILES.get('file') or request.FILES.get('archivo')
        if not uploaded:
            return Response({'detail': 'No se encontró archivo en la petición (field: file ó archivo).'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            info = validar_estructura_archivo(uploaded)
            if not info.get('ok'):
                return Response({'detail': 'Estructura inválida', 'missing': info.get('missing', [])}, status=status.HTTP_400_BAD_REQUEST)
            # rewind file if needed
            try:
                uploaded.seek(0)
            except Exception:
                pass
            result = importar_desde_excel(uploaded)
            return Response(result, status=status.HTTP_200_OK)
        except DjangoValidationError as e:
            return Response({'detail': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'detail': 'Error interno', 'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class PublicacionViewSet(NormalizedModelViewSet):
    queryset = Publicacion.objects.select_related('canton', 'ruta', 'atractivo_turistico').all()
    serializer_class = PublicacionSerializer
    filterset_fields = ['tipo', 'canton', 'ruta', 'atractivo_turistico', 'activo']
    search_fields = ['titulo', 'descripcion']
