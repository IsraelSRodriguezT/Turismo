from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status

from .models import Recurso, TipoRecurso


class RecursoAPITest(APITestCase):
    def test_list_and_create_recurso(self):
        url = reverse('recurso-list')

        # List vacío
        resp = self.client.get(url)
        self.assertEqual(resp.status_code, status.HTTP_200_OK)

        # Crear recurso válido
        data = {
            'titulo': 'Prueba API',
            'descripcion': 'Descripción',
            'url': 'http://example.com/1.jpg',
            'tipo_recurso': TipoRecurso.IMAGEN,
        }
        resp = self.client.post(url, data, format='json')
        self.assertIn(resp.status_code, (status.HTTP_201_CREATED, status.HTTP_200_OK))
        self.assertTrue(Recurso.objects.filter(titulo='Prueba API').exists())
from django.test import TestCase
from io import BytesIO

from .services import validar_estructura_archivo, importar_desde_excel
from .models import Recurso, TipoRecurso


class ImportServicesTests(TestCase):
	def setUp(self):
		Recurso.objects.all().delete()

	def test_validar_estructura_csv_ok(self):
		csv_content = 'titulo,descripcion,url,tipo_recurso\nT1,Desc,http://a.test,IMAGEN\n'
		f = BytesIO(csv_content.encode('utf-8'))
		f.name = 'test.csv'
		res = validar_estructura_archivo(f)
		self.assertTrue(res['ok'])
		self.assertEqual(res['missing'], [])

	def test_validar_estructura_csv_missing(self):
		csv_content = 'titulo,url,tipo_recurso\nT1,http://a.test,IMAGEN\n'
		f = BytesIO(csv_content.encode('utf-8'))
		f.name = 'test.csv'
		res = validar_estructura_archivo(f)
		self.assertFalse(res['ok'])
		self.assertIn('descripcion', res['missing'])

	def test_importar_desde_csv_creates_records_and_skips_duplicates(self):
		# prepare initial recurso to cause duplicate skip
		Recurso.objects.create(titulo='T1', descripcion='d', url='http://a.test', tipo_recurso=TipoRecurso.IMAGEN)
		csv_content = 'titulo,descripcion,url,tipo_recurso\nT1,Desc,http://a.test,IMAGEN\nT2,Desc2,http://b.test,VIDEO\n'
		f = BytesIO(csv_content.encode('utf-8'))
		f.name = 'import.csv'
		result = importar_desde_excel(f)
		self.assertEqual(result['created'], 1)
		self.assertEqual(len(result['skipped']), 1)
		self.assertEqual(Recurso.objects.filter(url='http://b.test').count(), 1)

