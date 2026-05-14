from rest_framework import viewsets, parsers, status
from rest_framework.decorators import action
from rest_framework.response import Response

from django.core.exceptions import ValidationError as DjangoValidationError

from .models import Recurso
from .serializers import RecursoSerializer
from .services import validar_estructura_archivo, importar_desde_excel


class RecursoViewSet(viewsets.ModelViewSet):
    queryset = Recurso.objects.all()
    serializer_class = RecursoSerializer

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
