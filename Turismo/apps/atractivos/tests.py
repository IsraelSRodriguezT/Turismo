from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APITestCase

from .models import AtractivoTuristico


class NormalizedResponseAssertions:
	def assert_normalized_response(self, response, expected_status):
		self.assertEqual(response.status_code, expected_status)
		self.assertIn('success', response.data)
		self.assertIn('message', response.data)
		self.assertIn('data', response.data)
		self.assertIn('errors', response.data)
		self.assertIn('meta', response.data)
		return response.data['data']


class AtractivosAPITests(NormalizedResponseAssertions, APITestCase):
	def setUp(self):
		User = get_user_model()
		self.usuario = User.objects.create_user(
			nickname='atractivo1',
			correo='atractivo1@example.com',
			nombre='Atr',
			apellido='User',
			clave='ClaveSegura123!',
		)
		self.client.force_authenticate(user=self.usuario)

	def test_get_atractivos_normalizado(self):
		response = self.client.get('/api/atractivos/atractivos/')
		data = self.assert_normalized_response(response, status.HTTP_200_OK)
		self.assertIsInstance(data, list)

	def test_post_atractivo_normalizado(self):
		response = self.client.post(
			'/api/atractivos/atractivos/',
			{
				'nombre': 'Playa',
				'descripcion': 'Playa principal',
				'nivel_accesibilidad': 'LIBRE',
				'estado_conservacion': 'CONSERVADO',
			},
			format='json',
		)
		data = self.assert_normalized_response(response, status.HTTP_201_CREATED)
		self.assertEqual(data['nombre'], 'Playa')
		self.assertTrue(AtractivoTuristico.objects.filter(nombre='Playa').exists())
