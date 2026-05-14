from django.contrib.auth import get_user_model
from django.contrib.auth.models import AnonymousUser
from django.test import RequestFactory
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from apps.usuarios.models import Perfil
from apps.usuarios.services import UsuarioService
from core.permissions import EsAdmin, EsTurista
from apps.atractivos.models import AtractivoTuristico


Usuario = get_user_model()


class AutenticacionUsuariosTests(APITestCase):
	def setUp(self):
		self.registro_url = reverse('usuarios:registro')
		self.login_url = reverse('usuarios:login')
		self.refresh_url = reverse('usuarios:refresh-token')
		self.cambiar_clave_url = reverse('usuarios:cambiar-contrasena')
		self.payload = {
			'nickname': 'turista1',
			'correo': 'turista1@example.com',
			'nombre': 'Ana',
			'apellido': 'Perez',
			'telefono': '0999999999',
			'clave': 'ClaveSegura123!',
			'clave_confirmacion': 'ClaveSegura123!',
		}

	def _crear_usuario(self):
		return Usuario.objects.create_user(
			nickname='turista2',
			correo='turista2@example.com',
			nombre='Luis',
			apellido='Lopez',
			telefono='0888888888',
			clave='ClaveSegura123!',
		)

	def test_registro_crea_usuario(self):
		response = self.client.post(self.registro_url, self.payload, format='json')

		self.assertEqual(response.status_code, status.HTTP_201_CREATED)
		self.assertTrue(Usuario.objects.filter(nickname='turista1').exists())
		self.assertNotIn('clave', response.data)

	def test_login_devuelve_tokens(self):
		self._crear_usuario()

		response = self.client.post(
			self.login_url,
			{'nickname': 'turista2', 'clave': 'ClaveSegura123!'},
			format='json',
		)

		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertIn('access', response.data)
		self.assertIn('refresh', response.data)

	def test_refresh_devuelve_nuevo_access(self):
		usuario = self._crear_usuario()
		login = self.client.post(
			self.login_url,
			{'nickname': usuario.nickname, 'clave': 'ClaveSegura123!'},
			format='json',
		)
		refresh = login.data['refresh']

		response = self.client.post(self.refresh_url, {'refresh': refresh}, format='json')

		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertIn('access', response.data)

	def test_cambiar_clave_requiere_autenticacion(self):
		usuario = self._crear_usuario()
		self.client.force_authenticate(usuario)

		response = self.client.post(
			self.cambiar_clave_url,
			{
				'clave_actual': 'ClaveSegura123!',
				'clave_nueva': 'ClaveNueva123!',
				'clave_nueva_confirmacion': 'ClaveNueva123!',
			},
			format='json',
		)

		self.assertEqual(response.status_code, status.HTTP_200_OK)
		usuario.refresh_from_db()
		self.assertTrue(usuario.check_password('ClaveNueva123!'))


class PerfilTests(APITestCase):
	def setUp(self):
		self.usuario = Usuario.objects.create_user(
			nickname='perfil1',
			correo='perfil1@example.com',
			nombre='Maria',
			apellido='Gomez',
			telefono='0777777777',
			clave='ClaveSegura123!',
		)
		self.perfil = UsuarioService.asegurar_perfil(self.usuario)
		self.perfil_url = reverse('usuarios:perfil-detail', kwargs={'pk': self.perfil.pk})

	def test_retrieve_perfil_propio_devuelve_derivados(self):
		self.client.force_authenticate(self.usuario)

		response = self.client.get(self.perfil_url)

		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertEqual(response.data['nickname'], 'perfil1')
		self.assertEqual(response.data['cantidad_visitas'], 0)
		self.assertEqual(response.data['puntuacion'], 0.0)

	def test_update_perfil_propio_actualiza_usuario(self):
		self.client.force_authenticate(self.usuario)

		response = self.client.patch(
			self.perfil_url,
			{
				'nombre': 'Maria Jose',
				'apellido': 'Gomez Ruiz',
				'telefono': '0666666666',
			},
			format='json',
		)

		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.usuario.refresh_from_db()
		self.assertEqual(self.usuario.nombre, 'Maria Jose')
		self.assertEqual(self.usuario.apellido, 'Gomez Ruiz')
		self.assertEqual(self.usuario.telefono, '0666666666')


class UsuarioAdminTests(APITestCase):
	def setUp(self):
		self.factory = RequestFactory()
		self.admin = Usuario.objects.create_user(
			nickname='admin1',
			correo='admin1@example.com',
			nombre='Admin',
			apellido='Root',
			telefono='0111111111',
			clave='ClaveSegura123!',
			roles=['ADMINISTRADOR'],
			is_staff=True,
		)
		self.usuario = Usuario.objects.create_user(
			nickname='usuario1',
			correo='usuario1@example.com',
			nombre='User',
			apellido='Normal',
			telefono='0222222222',
			clave='ClaveSegura123!',
		)
		self.list_url = reverse('usuarios:usuario-admin-list')
		self.detail_url = reverse('usuarios:usuario-admin-detail', kwargs={'pk': self.usuario.pk})

	def test_admin_puede_listar_usuarios(self):
		self.client.force_authenticate(self.admin)

		response = self.client.get(self.list_url)

		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.assertGreaterEqual(len(response.data), 2)

	def test_turista_no_puede_listar_usuarios(self):
		self.client.force_authenticate(self.usuario)

		response = self.client.get(self.list_url)

		self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

	def test_admin_puede_actualizar_usuario(self):
		self.client.force_authenticate(self.admin)

		response = self.client.patch(
			self.detail_url,
			{'nombre': 'Usuario Editado', 'roles': ['TURISTA']},
			format='json',
		)

		self.assertEqual(response.status_code, status.HTTP_200_OK)
		self.usuario.refresh_from_db()
		self.assertEqual(self.usuario.nombre, 'Usuario Editado')
		self.assertIn('TURISTA', self.usuario.roles)

	def test_admin_puede_eliminar_usuario(self):
		self.client.force_authenticate(self.admin)

		response = self.client.delete(self.detail_url)

		self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
		self.assertFalse(Usuario.objects.filter(pk=self.usuario.pk).exists())

	def test_permiso_es_admin(self):
		request = self.factory.get('/')
		request.user = self.admin
		self.assertTrue(EsAdmin().has_permission(request, None))

	def test_permiso_es_turista_rechaza_anonymous(self):
		request = self.factory.get('/')
		request.user = AnonymousUser()
		self.assertFalse(EsTurista().has_permission(request, None))


class ValoracionesFavoritosTests(APITestCase):
	def setUp(self):
		self.usuario = Usuario.objects.create_user(
			nickname='turista3',
			correo='turista3@example.com',
			nombre='Jose',
			apellido='Mena',
			telefono='0333333333',
			clave='ClaveSegura123!',
		)
		self.perfil = UsuarioService.asegurar_perfil(self.usuario)
		self.atractivo = AtractivoTuristico.objects.create(nombre='Playa', descripcion='Playa principal')
		self.valoraciones_url = reverse('usuarios:perfil-valoraciones', kwargs={'perfil_pk': self.perfil.pk})
		self.favoritos_url = reverse('usuarios:perfil-favoritos', kwargs={'perfil_pk': self.perfil.pk})

	def test_crear_y_listar_valoraciones(self):
		self.client.force_authenticate(self.usuario)

		response = self.client.post(
			self.valoraciones_url,
			{'atractivo_turistico': self.atractivo.pk, 'puntuacion': 5, 'comentario': 'Excelente'},
			format='json',
		)

		self.assertEqual(response.status_code, status.HTTP_201_CREATED)
		self.assertEqual(response.data['puntuacion'], 5)

		listado = self.client.get(self.valoraciones_url)
		self.assertEqual(listado.status_code, status.HTTP_200_OK)
		self.assertEqual(len(listado.data), 1)

	def test_eliminar_valoracion(self):
		self.client.force_authenticate(self.usuario)
		crear = self.client.post(
			self.valoraciones_url,
			{'atractivo_turistico': self.atractivo.pk, 'puntuacion': 4, 'comentario': 'Bien'},
			format='json',
		)
		valoracion_id = crear.data['id']
		url_detalle = reverse('usuarios:perfil-valoracion-detail', kwargs={'perfil_pk': self.perfil.pk, 'valoracion_pk': valoracion_id})

		response = self.client.delete(url_detalle)

		self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
		self.assertEqual(self.perfil.valoraciones.count(), 0)

	def test_crear_y_listar_favoritos(self):
		self.client.force_authenticate(self.usuario)

		response = self.client.post(
			self.favoritos_url,
			{'atractivo_turistico': self.atractivo.pk},
			format='json',
		)

		self.assertEqual(response.status_code, status.HTTP_201_CREATED)
		self.assertEqual(response.data['atractivo_turistico'], self.atractivo.pk)

		listado = self.client.get(self.favoritos_url)
		self.assertEqual(listado.status_code, status.HTTP_200_OK)
		self.assertEqual(len(listado.data), 1)

	def test_eliminar_favorito(self):
		self.client.force_authenticate(self.usuario)
		crear = self.client.post(
			self.favoritos_url,
			{'atractivo_turistico': self.atractivo.pk},
			format='json',
		)
		favorito_id = crear.data['id']
		url_detalle = reverse('usuarios:perfil-favorito-detail', kwargs={'perfil_pk': self.perfil.pk, 'favorito_pk': favorito_id})

		response = self.client.delete(url_detalle)

		self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
		self.assertEqual(self.perfil.favoritos.count(), 0)
