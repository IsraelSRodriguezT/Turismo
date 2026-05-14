from django.shortcuts import get_object_or_404
from rest_framework import status, viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.serializers import TokenRefreshSerializer
from rest_framework_simplejwt.tokens import RefreshToken

from apps.usuarios.models import Favorito, Perfil, Rol, TipoAccion, Valoracion, Usuario
from apps.usuarios.serializers import (
	CambioClaveSerializer,
	FavoritoSerializer,
	LoginSerializer,
	PerfilSerializer,
	RegistroSerializer,
	UsuarioAdminSerializer,
	UsuarioSerializer,
	ValoracionSerializer,
)
from apps.usuarios.services import UsuarioService
from core.permissions import EsAdmin, EsOwnerOAdmin


class RegistroAPIView(APIView):
	permission_classes = [AllowAny]

	def post(self, request):
		serializer = RegistroSerializer(data=request.data)
		serializer.is_valid(raise_exception=True)
		usuario = serializer.save()
		return Response(UsuarioSerializer(usuario).data, status=status.HTTP_201_CREATED)


class LoginAPIView(APIView):
	permission_classes = [AllowAny]

	def post(self, request):
		serializer = LoginSerializer(data=request.data)
		serializer.is_valid(raise_exception=True)
		usuario = UsuarioService.autenticar(
			serializer.validated_data['nickname'],
			serializer.validated_data['clave'],
		)
		if not usuario:
			return Response({'detail': 'Credenciales invalidas.'}, status=status.HTTP_400_BAD_REQUEST)

		refresh = RefreshToken.for_user(usuario)
		return Response(
			{
				'refresh': str(refresh),
				'access': str(refresh.access_token),
				'usuario': UsuarioSerializer(usuario).data,
			}
		)


class RefreshTokenAPIView(APIView):
	permission_classes = [AllowAny]

	def post(self, request):
		serializer = TokenRefreshSerializer(data=request.data)
		serializer.is_valid(raise_exception=True)
		return Response(serializer.validated_data)


class CambioClaveAPIView(APIView):
	permission_classes = [IsAuthenticated]

	def post(self, request):
		serializer = CambioClaveSerializer(data=request.data)
		serializer.is_valid(raise_exception=True)
		UsuarioService.cambiar_clave(
			request.user,
			serializer.validated_data['clave_actual'],
			serializer.validated_data['clave_nueva'],
		)
		return Response({'detail': 'Clave actualizada correctamente.'})


class PerfilViewSet(viewsets.ModelViewSet):
	serializer_class = PerfilSerializer
	permission_classes = [IsAuthenticated, EsOwnerOAdmin]
	http_method_names = ['get', 'put', 'patch', 'head', 'options']

	def get_queryset(self):
		usuario = self.request.user
		if usuario and usuario.is_authenticated and usuario.tiene_rol(Rol.ADMINISTRADOR):
			return Perfil.objects.select_related('usuario').all()
		return Perfil.objects.select_related('usuario').filter(usuario=usuario)

	def get_object(self):
		usuario = self.request.user
		if usuario and usuario.is_authenticated and usuario.tiene_rol(Rol.ADMINISTRADOR):
			return super().get_object()
		return UsuarioService.asegurar_perfil(usuario)

	def _obtener_perfil_autorizado(self, perfil_pk):
		perfil = get_object_or_404(Perfil.objects.select_related('usuario'), pk=perfil_pk)
		usuario = self.request.user
		if not usuario.is_authenticated:
			self.permission_denied(self.request)
		if not usuario.tiene_rol(Rol.ADMINISTRADOR) and perfil.usuario_id != usuario.id:
			self.permission_denied(self.request)
		return perfil


class PerfilValoracionAPIView(APIView):
	permission_classes = [IsAuthenticated]

	def get(self, request, perfil_pk):
		perfil = get_object_or_404(Perfil.objects.select_related('usuario'), pk=perfil_pk)
		if not request.user.tiene_rol(Rol.ADMINISTRADOR) and perfil.usuario_id != request.user.id:
			return Response(status=status.HTTP_403_FORBIDDEN)
		valoraciones = Valoracion.objects.select_related('perfil', 'atractivo_turistico').filter(perfil=perfil).order_by('-fecha_registro', '-id')
		serializer = ValoracionSerializer(valoraciones, many=True)
		return Response(serializer.data)

	def post(self, request, perfil_pk):
		perfil = get_object_or_404(Perfil.objects.select_related('usuario'), pk=perfil_pk)
		if not request.user.tiene_rol(Rol.ADMINISTRADOR) and perfil.usuario_id != request.user.id:
			return Response(status=status.HTTP_403_FORBIDDEN)
		serializer = ValoracionSerializer(data=request.data)
		serializer.is_valid(raise_exception=True)
		valoracion = serializer.save(perfil=perfil)
		UsuarioService.registrar_modificacion(
			request.user,
			f'Creación de valoración {valoracion.id}',
			atractivo_turistico=valoracion.atractivo_turistico,
			tipo_accion=TipoAccion.CREACION,
		)
		return Response(ValoracionSerializer(valoracion).data, status=status.HTTP_201_CREATED)


class PerfilValoracionDetalleAPIView(APIView):
	permission_classes = [IsAuthenticated]

	def delete(self, request, perfil_pk, valoracion_pk):
		perfil = get_object_or_404(Perfil.objects.select_related('usuario'), pk=perfil_pk)
		if not request.user.tiene_rol(Rol.ADMINISTRADOR) and perfil.usuario_id != request.user.id:
			return Response(status=status.HTTP_403_FORBIDDEN)
		valoracion = get_object_or_404(Valoracion, pk=valoracion_pk, perfil=perfil)
		UsuarioService.registrar_modificacion(
			request.user,
			f'Eliminación de valoración {valoracion.id}',
			atractivo_turistico=valoracion.atractivo_turistico,
			tipo_accion=TipoAccion.ELIMINACION,
		)
		valoracion.delete()
		return Response(status=status.HTTP_204_NO_CONTENT)


class PerfilFavoritoAPIView(APIView):
	permission_classes = [IsAuthenticated]

	def get(self, request, perfil_pk):
		perfil = get_object_or_404(Perfil.objects.select_related('usuario'), pk=perfil_pk)
		if not request.user.tiene_rol(Rol.ADMINISTRADOR) and perfil.usuario_id != request.user.id:
			return Response(status=status.HTTP_403_FORBIDDEN)
		favoritos = Favorito.objects.select_related('perfil', 'atractivo_turistico').filter(perfil=perfil).order_by('-fecha_guardado', '-id')
		serializer = FavoritoSerializer(favoritos, many=True)
		return Response(serializer.data)

	def post(self, request, perfil_pk):
		perfil = get_object_or_404(Perfil.objects.select_related('usuario'), pk=perfil_pk)
		if not request.user.tiene_rol(Rol.ADMINISTRADOR) and perfil.usuario_id != request.user.id:
			return Response(status=status.HTTP_403_FORBIDDEN)
		serializer = FavoritoSerializer(data=request.data)
		serializer.is_valid(raise_exception=True)
		favorito = serializer.save(perfil=perfil)
		UsuarioService.registrar_modificacion(
			request.user,
			f'Creación de favorito {favorito.id}',
			atractivo_turistico=favorito.atractivo_turistico,
			tipo_accion=TipoAccion.CREACION,
		)
		return Response(FavoritoSerializer(favorito).data, status=status.HTTP_201_CREATED)


class PerfilFavoritoDetalleAPIView(APIView):
	permission_classes = [IsAuthenticated]

	def delete(self, request, perfil_pk, favorito_pk):
		perfil = get_object_or_404(Perfil.objects.select_related('usuario'), pk=perfil_pk)
		if not request.user.tiene_rol(Rol.ADMINISTRADOR) and perfil.usuario_id != request.user.id:
			return Response(status=status.HTTP_403_FORBIDDEN)
		favorito = get_object_or_404(Favorito, pk=favorito_pk, perfil=perfil)
		UsuarioService.registrar_modificacion(
			request.user,
			f'Eliminación de favorito {favorito.id}',
			atractivo_turistico=favorito.atractivo_turistico,
			tipo_accion=TipoAccion.ELIMINACION,
		)
		favorito.delete()
		return Response(status=status.HTTP_204_NO_CONTENT)


class UsuarioAdminViewSet(viewsets.ModelViewSet):
	serializer_class = UsuarioAdminSerializer
	permission_classes = [IsAuthenticated, EsAdmin]
	queryset = Usuario.objects.all().order_by('nickname')

	def perform_destroy(self, instance):
		UsuarioService.registrar_modificacion(
			self.request.user,
			f'Eliminación de usuario {instance.nickname}',
			tipo_accion=TipoAccion.ELIMINACION,
		)
		return super().perform_destroy(instance)
