from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Canton, Pais, Provincia, Parroquia, Sector


class NormalizedResponseAssertions:
	def assert_normalized_response(self, response, expected_status):
		self.assertEqual(response.status_code, expected_status)
		self.assertIn('success', response.data)
		self.assertIn('message', response.data)
		self.assertIn('data', response.data)
		self.assertIn('errors', response.data)
		self.assertIn('meta', response.data)
		return response.data['data']


class GeolocalizacionAPITests(NormalizedResponseAssertions, APITestCase):
	def setUp(self):
		User = get_user_model()
		self.usuario = User.objects.create_user(
			nickname='geo1',
			correo='geo1@example.com',
			nombre='Geo',
			apellido='User',
			clave='ClaveSegura123!',
		)
		self.client.force_authenticate(user=self.usuario)
		self.pais = Pais.objects.create(nombre='Ecuador')
		self.provincia = Provincia.objects.create(nombre='Pichincha', pais=self.pais)
		self.canton = Canton.objects.create(nombre='Quito', provincia=self.provincia)
		self.parroquia = Parroquia.objects.create(nombre='Centro Histórico', canton=self.canton)
		self.sector = Sector.objects.create(nombre='La Ronda', parroquia=self.parroquia)

	def test_get_paises_normalizado(self):
		response = self.client.get('/api/geolocalizacion/paises/')
		data = self.assert_normalized_response(response, status.HTTP_200_OK)
		self.assertGreaterEqual(len(data), 1)
		self.assertEqual(data[0]['nombre'], 'Ecuador')

	def test_get_jerarquia_normalizada(self):
		response = self.client.get('/api/geolocalizacion/jerarquia/')
		data = self.assert_normalized_response(response, status.HTTP_200_OK)
		self.assertGreaterEqual(len(data), 1)
		self.assertEqual(data[0]['nombre'], 'Ecuador')
