from io import BytesIO
from unittest.mock import patch

from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APITestCase

from apps.atractivos.models import AtractivoTuristico
from .models import Recurso, TipoRecurso
from .services import importar_desde_excel, validar_estructura_archivo


class NormalizedResponseAssertions:
    def assert_normalized_response(self, response, expected_status):
        self.assertEqual(response.status_code, expected_status)
        self.assertIn('success', response.data)
        self.assertIn('message', response.data)
        self.assertIn('data', response.data)
        self.assertIn('errors', response.data)
        self.assertIn('meta', response.data)
        return response.data['data']


class RecursoAPITest(NormalizedResponseAssertions, APITestCase):
    def setUp(self):
        User = get_user_model()
        self.usuario = User.objects.create_user(
            nickname='inventario1',
            correo='inventario1@example.com',
            nombre='Inv',
            apellido='User',
            clave='ClaveSegura123!',
        )
        self.client.force_authenticate(user=self.usuario)
        self.atractivo = AtractivoTuristico.objects.create(
            nombre='Playa Central',
            descripcion='Atractivo principal',
        )

    def test_list_and_create_recurso(self):
        url = '/api/inventario/recursos/'

        listado = self.client.get(url)
        self.assert_normalized_response(listado, status.HTTP_200_OK)

        data = {
            'atractivo_turistico': self.atractivo.pk,
            'titulo': 'Prueba API',
            'descripcion': 'Descripción',
            'url': 'http://example.com/1.jpg',
            'tipo_recurso': TipoRecurso.IMAGEN,
        }
        resp = self.client.post(url, data, format='json')
        payload = self.assert_normalized_response(resp, status.HTTP_201_CREATED)
        self.assertTrue(Recurso.objects.filter(titulo='Prueba API').exists())
        self.assertEqual(payload['atractivo_turistico'], self.atractivo.pk)


class ImportServicesTests(TestCase):
    def setUp(self):
        self.atractivo = AtractivoTuristico.objects.create(
            nombre='Playa Central',
            descripcion='Atractivo principal',
        )
        Recurso.objects.all().delete()

    def test_validar_estructura_csv_ok(self):
        csv_content = 'titulo,descripcion,url,tipo_recurso\nT1,Desc,http://a.test,IMAGEN\n'
        archivo = BytesIO(csv_content.encode('utf-8'))
        archivo.name = 'test.csv'
        resultado = validar_estructura_archivo(archivo)
        self.assertTrue(resultado['ok'])
        self.assertEqual(resultado['missing'], [])

    def test_validar_estructura_csv_missing(self):
        csv_content = 'titulo,url,tipo_recurso\nT1,http://a.test,IMAGEN\n'
        archivo = BytesIO(csv_content.encode('utf-8'))
        archivo.name = 'test.csv'
        resultado = validar_estructura_archivo(archivo)
        self.assertFalse(resultado['ok'])
        self.assertIn('descripcion', resultado['missing'])

    @patch('apps.inventario.services.crear_recurso')
    def test_importar_desde_csv_creates_records_and_skips_duplicates(self, crear_recurso_mock):
        Recurso.objects.create(
            atractivo_turistico=self.atractivo,
            titulo='T1',
            descripcion='d',
            url='http://a.test',
            tipo_recurso=TipoRecurso.IMAGEN,
        )
        crear_recurso_mock.return_value = None

        csv_content = 'titulo,descripcion,url,tipo_recurso\nT1,Desc,http://a.test,IMAGEN\nT2,Desc2,http://b.test,VIDEO\n'
        archivo = BytesIO(csv_content.encode('utf-8'))
        archivo.name = 'import.csv'
        resultado = importar_desde_excel(archivo)

        self.assertEqual(resultado['created'], 1)
        self.assertEqual(len(resultado['skipped']), 1)
        crear_recurso_mock.assert_called_once()
