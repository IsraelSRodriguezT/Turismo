from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient

from apps.geolocalizacion.models import Canton, Pais, Provincia, Sector
from .models import Actor, Evidencia, Impacto, PlanAccion, ProyectoInvestigacion, TipoEvidencia
from .serializers import ImpactoSerializer, ProyectoInvestigacionSerializer


class NormalizedResponseAssertions:
    def assert_normalized_response(self, response, expected_status):
        self.assertEqual(response.status_code, expected_status)
        self.assertIn('success', response.data)
        self.assertIn('message', response.data)
        self.assertIn('data', response.data)
        self.assertIn('errors', response.data)
        self.assertIn('meta', response.data)
        return response.data['data']


class ProyectoInvestigacionModelTests(TestCase):
    def test_create_proyecto(self):
        proyecto = ProyectoInvestigacion.objects.create(
            titulo='Investigación Turística',
            descripcion='Descripción',
            fecha_inicio='2026-05-01',
            fecha_fin='2026-06-01',
            objetivo='Objetivo',
        )
        self.assertEqual(str(proyecto), 'Investigación Turística')

    def test_fecha_validation_proyecto(self):
        proyecto = ProyectoInvestigacion(
            titulo='Test',
            descripcion='Desc',
            fecha_inicio='2026-06-01',
            fecha_fin='2026-05-01',
            objetivo='Obj',
        )
        with self.assertRaises(ValidationError):
            proyecto.full_clean()


class ActorModelTests(TestCase):
    def setUp(self):
        self.proyecto = ProyectoInvestigacion.objects.create(
            titulo='Proyecto',
            descripcion='Desc',
            fecha_inicio='2026-05-01',
            fecha_fin='2026-06-01',
            objetivo='Obj',
        )

    def test_create_actor(self):
        actor = Actor.objects.create(
            proyecto=self.proyecto,
            nombre='Juan',
            apellido='Pérez',
            correo='juan.perez@example.com',
            telefono='0999999999',
            organizacion='ONG Turismo',
        )
        self.assertEqual(str(actor), 'Juan (ONG Turismo)')


class EvidenciaModelTests(TestCase):
    def setUp(self):
        self.proyecto = ProyectoInvestigacion.objects.create(
            titulo='Proyecto',
            descripcion='Desc',
            fecha_inicio='2026-05-01',
            fecha_fin='2026-06-01',
            objetivo='Obj',
        )

    def test_create_evidencia(self):
        evidencia = Evidencia.objects.create(
            proyecto=self.proyecto,
            titulo='Hallazgo importante',
            descripcion='Descripción',
            tipo_evidencia=TipoEvidencia.PRODUCTO,
            recomendacion='Seguir monitoreo',
        )
        self.assertEqual(str(evidencia), 'Hallazgo importante (PRODUCTO)')


class PlanAccionModelTests(TestCase):
    def setUp(self):
        self.proyecto = ProyectoInvestigacion.objects.create(
            titulo='Proyecto',
            descripcion='Desc',
            fecha_inicio='2026-05-01',
            fecha_fin='2026-06-01',
            objetivo='Obj',
        )

    def test_fecha_validation_plan(self):
        plan = PlanAccion(
            proyecto=self.proyecto,
            nombre='Plan',
            descripcion='Desc',
            fecha_inicio='2026-06-01',
            fecha_fin='2026-05-01',
        )
        with self.assertRaises(ValidationError):
            plan.full_clean()


class ImpactoModelTests(TestCase):
    def setUp(self):
        self.proyecto = ProyectoInvestigacion.objects.create(
            titulo='Proyecto',
            descripcion='Desc',
            fecha_inicio='2026-05-01',
            fecha_fin='2026-06-01',
            objetivo='Obj',
        )

    def test_nivel_impacto_validation(self):
        impacto = Impacto(
            proyecto=self.proyecto,
            descripcion='Desc',
            nivel_impacto=15,
            fecha_evaluacion='2026-06-01',
        )
        with self.assertRaises(ValidationError):
            impacto.full_clean()


class ProyectoInvestigacionSerializerTests(TestCase):
    def test_fecha_validation_serializer(self):
        data = {
            'titulo': 'Proyecto',
            'descripcion': 'Desc',
            'fecha_inicio': '2026-06-01',
            'fecha_fin': '2026-05-01',
            'objetivo': 'Obj',
        }
        serializer = ProyectoInvestigacionSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('fecha_fin', serializer.errors)


class ImpactoSerializerTests(TestCase):
    def test_nivel_impacto_serializer_validation(self):
        data = {
            'descripcion': 'Desc',
            'nivel_impacto': 15,
            'fecha_evaluacion': '2026-06-01',
        }
        serializer = ImpactoSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('nivel_impacto', serializer.errors)


class ProyectoInvestigacionAPITests(NormalizedResponseAssertions, TestCase):
    def setUp(self):
        User = get_user_model()
        self.client = APIClient()
        self.usuario = User.objects.create_user(
            nickname='apiuser',
            correo='apiuser@example.com',
            nombre='Api',
            apellido='User',
            clave='pass12345',
        )
        self.otra_usuario = User.objects.create_user(
            nickname='apiuser2',
            correo='apiuser2@example.com',
            nombre='Api2',
            apellido='User2',
            clave='pass12345',
        )
        self.pais = Pais.objects.create(nombre='Ecuador')
        self.provincia = Provincia.objects.create(nombre='Pichincha', pais=self.pais)
        self.sector = Sector.objects.create(nombre='Centro', parroquia=self._crear_parroquia())
        self.proyecto = ProyectoInvestigacion.objects.create(
            titulo='Proyecto API',
            descripcion='Descripción API',
            fecha_inicio='2026-05-01',
            fecha_fin='2026-06-01',
            objetivo='Objetivo API',
            sector=self.sector,
        )

    def _crear_parroquia(self):
        canton = Canton.objects.create(nombre='Quito', provincia=self.provincia)
        return canton.parroquias.create(nombre='Centro Histórico')

    def autenticar(self, user=None):
        self.client.force_authenticate(user=user or self.usuario)

    def test_crud_proyecto(self):
        self.autenticar()

        listado = self.client.get('/api/investigacion/proyectos/')
        listado_data = self.assert_normalized_response(listado, status.HTTP_200_OK)
        self.assertGreaterEqual(len(listado_data), 1)

        crear = self.client.post(
            '/api/investigacion/proyectos/',
            {
                'titulo': 'Proyecto Nuevo',
                'descripcion': 'Descripción nueva',
                'fecha_inicio': '2026-07-01',
                'fecha_fin': '2026-08-01',
                'objetivo': 'Objetivo nuevo',
                'sector': self.sector.pk,
            },
            format='json',
        )
        crear_data = self.assert_normalized_response(crear, status.HTTP_201_CREATED)
        proyecto_id = crear_data['id']

        detalle = self.client.get(f'/api/investigacion/proyectos/{proyecto_id}/')
        detalle_data = self.assert_normalized_response(detalle, status.HTTP_200_OK)
        self.assertEqual(detalle_data['titulo'], 'Proyecto Nuevo')

        actualizar = self.client.patch(
            f'/api/investigacion/proyectos/{proyecto_id}/',
            {'objetivo': 'Objetivo actualizado'},
            format='json',
        )
        actualizar_data = self.assert_normalized_response(actualizar, status.HTTP_200_OK)
        self.assertEqual(actualizar_data['objetivo'], 'Objetivo actualizado')

        eliminar = self.client.delete(f'/api/investigacion/proyectos/{proyecto_id}/')
        self.assertEqual(eliminar.status_code, status.HTTP_204_NO_CONTENT)

    def test_permisos(self):
        anonimo = APIClient()

        listado = anonimo.get('/api/investigacion/proyectos/')
        self.assertEqual(listado.status_code, status.HTTP_200_OK)
        self.assertIn('success', listado.data)
        self.assertTrue(listado.data['success'])
        self.assertEqual(
            anonimo.post(
                '/api/investigacion/proyectos/',
                {
                    'titulo': 'Sin permiso',
                    'descripcion': 'Desc',
                    'fecha_inicio': '2026-07-01',
                    'fecha_fin': '2026-08-01',
                    'objetivo': 'Obj',
                },
                format='json',
            ).status_code,
            status.HTTP_401_UNAUTHORIZED,
        )

    def test_busqueda_y_filtrado(self):
        self.autenticar()
        ProyectoInvestigacion.objects.create(
            titulo='Turismo Comunitario',
            descripcion='Estudio de turismo comunitario',
            fecha_inicio='2026-04-01',
            fecha_fin='2026-05-01',
            objetivo='Analizar impactos',
            sector=self.sector,
        )

        respuesta_busqueda = self.client.get('/api/investigacion/proyectos/', {'q': 'Comunitario'})
        respuesta_busqueda_data = self.assert_normalized_response(respuesta_busqueda, status.HTTP_200_OK)
        self.assertGreaterEqual(len(respuesta_busqueda_data), 1)

        respuesta_fechas = self.client.get(
            '/api/investigacion/proyectos/',
            {'fecha_inicio_gte': '2026-05-01', 'fecha_fin_lte': '2026-06-30'},
        )
        respuesta_fechas_data = self.assert_normalized_response(respuesta_fechas, status.HTTP_200_OK)
        self.assertGreaterEqual(len(respuesta_fechas_data), 1)

    def test_validaciones_fallidas(self):
        self.autenticar()

        respuesta = self.client.post(
            '/api/investigacion/proyectos/',
            {
                'titulo': 'Proyecto inválido',
                'descripcion': 'Desc',
                'fecha_inicio': '2026-08-01',
                'fecha_fin': '2026-07-01',
                'objetivo': 'Obj',
            },
            format='json',
        )
        self.assertEqual(respuesta.status_code, status.HTTP_422_UNPROCESSABLE_ENTITY)
        self.assertFalse(respuesta.data['success'])
        self.assertTrue(any(item['field'] == 'fecha_fin' for item in respuesta.data['errors']['details']))

        respuesta_impacto = self.client.post(
            '/api/investigacion/impactos/',
            {
                'proyecto': self.proyecto.id,
                'descripcion': 'Impacto',
                'nivel_impacto': 15,
                'fecha_evaluacion': '2026-06-01',
            },
            format='json',
        )
        self.assertEqual(respuesta_impacto.status_code, status.HTTP_422_UNPROCESSABLE_ENTITY)
        self.assertFalse(respuesta_impacto.data['success'])
        self.assertTrue(any(item['field'] == 'nivel_impacto' for item in respuesta_impacto.data['errors']['details']))

    def test_relaciones_y_cascadas(self):
        self.autenticar()

        respuesta_actor = self.client.post(
            f'/api/investigacion/proyectos/{self.proyecto.id}/actores/',
            {
                'nombre': 'Actor API',
                'apellido': 'Prueba',
                'correo': 'actor@example.com',
                'telefono': '0999999999',
                'organizacion': 'Organización API',
            },
            format='json',
        )
        respuesta_actor_data = self.assert_normalized_response(respuesta_actor, status.HTTP_201_CREATED)
        self.assertEqual(respuesta_actor_data['organizacion'], 'Organización API')

        respuesta_evidencia = self.client.post(
            f'/api/investigacion/proyectos/{self.proyecto.id}/evidencias/',
            {
                'titulo': 'Evidencia API',
                'descripcion': 'Descripción evidencia',
                'tipo_evidencia': TipoEvidencia.RESULTADO,
                'recomendacion': 'Seguir monitoreo',
            },
            format='json',
        )
        respuesta_evidencia_data = self.assert_normalized_response(respuesta_evidencia, status.HTTP_201_CREATED)
        self.assertEqual(respuesta_evidencia_data['tipo_evidencia'], TipoEvidencia.RESULTADO)

        respuesta_plan = self.client.post(
            f'/api/investigacion/proyectos/{self.proyecto.id}/planes-accion/',
            {
                'nombre': 'Plan API',
                'descripcion': 'Descripción plan',
                'fecha_inicio': '2026-05-21',
                'fecha_fin': '2026-06-21',
            },
            format='json',
        )
        self.assertEqual(respuesta_plan.status_code, status.HTTP_201_CREATED)
        self.assertTrue(respuesta_plan.data['success'])

        respuesta_impacto = self.client.post(
            f'/api/investigacion/proyectos/{self.proyecto.id}/impactos/',
            {
                'descripcion': 'Impacto API',
                'nivel_impacto': 8,
                'fecha_evaluacion': '2026-06-22',
            },
            format='json',
        )
        self.assertEqual(respuesta_impacto.status_code, status.HTTP_201_CREATED)
        self.assertTrue(respuesta_impacto.data['success'])

        self.assertEqual(self.proyecto.actores.count(), 1)
        self.assertEqual(self.proyecto.evidencias.count(), 1)
        self.assertEqual(self.proyecto.planes_accion.count(), 1)
        self.assertEqual(self.proyecto.impactos.count(), 1)

        self.proyecto.delete()
        self.assertEqual(Actor.objects.count(), 0)
        self.assertEqual(Evidencia.objects.count(), 0)
        self.assertEqual(PlanAccion.objects.count(), 0)
        self.assertEqual(Impacto.objects.count(), 0)
