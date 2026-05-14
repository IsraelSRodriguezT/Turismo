from django.test import TestCase
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from rest_framework.test import APIClient
from .models import ProyectoInvestigacion, Actor, Evidencia, PlanAccion, Impacto
from .serializers import ProyectoInvestigacionSerializer, ImpactoSerializer


class ProyectoInvestigacionModelTests(TestCase):
    def setUp(self):
        User = get_user_model()
        self.user = User.objects.create_user(username="tester", password="pass")

    def test_create_proyecto(self):
        p = ProyectoInvestigacion.objects.create(
            titulo="Investigación Turística",
            descripcion="Descripción",
            fechaInicio="2026-05-01",
            fechaFin="2026-06-01",
            objetivo="Objetivo",
            responsable=self.user,
        )
        self.assertEqual(str(p), "Investigación Turística")

    def test_fecha_validation_proyecto(self):
        p = ProyectoInvestigacion(
            titulo="Test",
            descripcion="Desc",
            fechaInicio="2026-06-01",
            fechaFin="2026-05-01",
            objetivo="Obj",
        )
        with self.assertRaises(ValidationError):
            p.full_clean()


class ActorModelTests(TestCase):
    def setUp(self):
        self.proyecto = ProyectoInvestigacion.objects.create(
            titulo="Proyecto",
            descripcion="Desc",
            fechaInicio="2026-05-01",
            fechaFin="2026-06-01",
            objetivo="Obj",
        )

    def test_create_actor(self):
        actor = Actor.objects.create(
            proyecto=self.proyecto,
            nombre="Juan Pérez",
            organizacion="ONG Turismo",
            rol="Coordinador",
        )
        self.assertEqual(str(actor), "Juan Pérez (ONG Turismo)")


class EvidenciaModelTests(TestCase):
    def setUp(self):
        self.proyecto = ProyectoInvestigacion.objects.create(
            titulo="Proyecto",
            descripcion="Desc",
            fechaInicio="2026-05-01",
            fechaFin="2026-06-01",
            objetivo="Obj",
        )

    def test_create_evidencia(self):
        evidencia = Evidencia.objects.create(
            proyecto=self.proyecto,
            titulo="Hallazgo importante",
            descripcion="Descripción",
            fechaRegistro="2026-05-15",
            tipoEvidencia="PRODUCTO",
        )
        self.assertEqual(str(evidencia), "Hallazgo importante (PRODUCTO)")


class PlanAccionModelTests(TestCase):
    def setUp(self):
        self.proyecto = ProyectoInvestigacion.objects.create(
            titulo="Proyecto",
            descripcion="Desc",
            fechaInicio="2026-05-01",
            fechaFin="2026-06-01",
            objetivo="Obj",
        )

    def test_fecha_validation_plan(self):
        plan = PlanAccion(
            proyecto=self.proyecto,
            nombre="Plan",
            descripcion="Desc",
            fechaInicio="2026-06-01",
            fechaFin="2026-05-01",
            estado="pendiente",
        )
        with self.assertRaises(ValidationError):
            plan.full_clean()


class ImpactoModelTests(TestCase):
    def setUp(self):
        self.proyecto = ProyectoInvestigacion.objects.create(
            titulo="Proyecto",
            descripcion="Desc",
            fechaInicio="2026-05-01",
            fechaFin="2026-06-01",
            objetivo="Obj",
        )

    def test_nivel_impacto_validation(self):
        impacto = Impacto(
            proyecto=self.proyecto,
            descripcion="Desc",
            nivelImpacto=15,
            fechaEvaluacion="2026-06-01",
        )
        with self.assertRaises(ValidationError):
            impacto.full_clean()


class ProyectoInvestigacionSerializerTests(TestCase):
    def test_fecha_validation_serializer(self):
        data = {
            "titulo": "Proyecto",
            "descripcion": "Desc",
            "fechaInicio": "2026-06-01",
            "fechaFin": "2026-05-01",
            "objetivo": "Obj",
        }
        serializer = ProyectoInvestigacionSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("fechaFin", serializer.errors)


class ImpactoSerializerTests(TestCase):
    def test_nivel_impacto_serializer_validation(self):
        data = {
            "descripcion": "Desc",
            "nivelImpacto": 15,
            "fechaEvaluacion": "2026-06-01",
        }
        serializer = ImpactoSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn("nivelImpacto", serializer.errors)


class ProyectoInvestigacionAPITests(TestCase):
    def setUp(self):
        User = get_user_model()
        self.client = APIClient()
        self.usuario = User.objects.create_user(username="apiuser", password="pass12345")
        self.otra_usuario = User.objects.create_user(username="apiuser2", password="pass12345")
        self.proyecto = ProyectoInvestigacion.objects.create(
            titulo="Proyecto API",
            descripcion="Descripción API",
            fechaInicio="2026-05-01",
            fechaFin="2026-06-01",
            objetivo="Objetivo API",
            responsable=self.usuario,
            estado=ProyectoInvestigacion.ESTADO_EN_PROGRESO,
        )

    def autenticar(self, user=None):
        self.client.force_authenticate(user=user or self.usuario)

    def test_crud_proyecto(self):
        self.autenticar()

        listado = self.client.get("/api/investigacion/proyectos/")
        self.assertEqual(listado.status_code, 200)
        self.assertGreaterEqual(len(listado.data), 1)

        crear = self.client.post(
            "/api/investigacion/proyectos/",
            {
                "titulo": "Proyecto Nuevo",
                "descripcion": "Descripción nueva",
                "fechaInicio": "2026-07-01",
                "fechaFin": "2026-08-01",
                "objetivo": "Objetivo nuevo",
                "estado": ProyectoInvestigacion.ESTADO_BORRADOR,
            },
            format="json",
        )
        self.assertEqual(crear.status_code, 201)
        proyecto_id = crear.data["id"]

        detalle = self.client.get(f"/api/investigacion/proyectos/{proyecto_id}/")
        self.assertEqual(detalle.status_code, 200)
        self.assertEqual(detalle.data["titulo"], "Proyecto Nuevo")

        actualizar = self.client.patch(
            f"/api/investigacion/proyectos/{proyecto_id}/",
            {"estado": ProyectoInvestigacion.ESTADO_FINALIZADO},
            format="json",
        )
        self.assertEqual(actualizar.status_code, 200)
        self.assertEqual(actualizar.data["estado"], ProyectoInvestigacion.ESTADO_FINALIZADO)

        eliminar = self.client.delete(f"/api/investigacion/proyectos/{proyecto_id}/")
        self.assertEqual(eliminar.status_code, 204)

    def test_permisos(self):
        anonimo = APIClient()

        self.assertEqual(anonimo.get("/api/investigacion/proyectos/").status_code, 200)
        self.assertEqual(
            anonimo.post(
                "/api/investigacion/proyectos/",
                {
                    "titulo": "Sin permiso",
                    "descripcion": "Desc",
                    "fechaInicio": "2026-07-01",
                    "fechaFin": "2026-08-01",
                    "objetivo": "Obj",
                },
                format="json",
            ).status_code,
            403,
        )

    def test_busqueda_y_filtrado(self):
        self.autenticar()
        ProyectoInvestigacion.objects.create(
            titulo="Turismo Comunitario",
            descripcion="Estudio de turismo comunitario",
            fechaInicio="2026-04-01",
            fechaFin="2026-05-01",
            objetivo="Analizar impactos",
            estado=ProyectoInvestigacion.ESTADO_FINALIZADO,
            responsable=self.otra_usuario,
        )

        respuesta_busqueda = self.client.get("/api/investigacion/proyectos/", {"q": "Comunitario"})
        self.assertEqual(respuesta_busqueda.status_code, 200)
        self.assertGreaterEqual(len(respuesta_busqueda.data), 1)

        respuesta_estado = self.client.get(
            "/api/investigacion/proyectos/", {"estado": ProyectoInvestigacion.ESTADO_EN_PROGRESO}
        )
        self.assertEqual(respuesta_estado.status_code, 200)
        self.assertTrue(all(item["estado"] == ProyectoInvestigacion.ESTADO_EN_PROGRESO for item in respuesta_estado.data))

        respuesta_responsable = self.client.get("/api/investigacion/proyectos/", {"responsable": self.usuario.id})
        self.assertEqual(respuesta_responsable.status_code, 200)
        self.assertTrue(all(item["responsable"] == self.usuario.id for item in respuesta_responsable.data))

        respuesta_fechas = self.client.get(
            "/api/investigacion/proyectos/",
            {"fechaInicio_gte": "2026-05-01", "fechaFin_lte": "2026-06-30"},
        )
        self.assertEqual(respuesta_fechas.status_code, 200)
        self.assertGreaterEqual(len(respuesta_fechas.data), 1)

    def test_validaciones_fallidas(self):
        self.autenticar()

        respuesta = self.client.post(
            "/api/investigacion/proyectos/",
            {
                "titulo": "Proyecto inválido",
                "descripcion": "Desc",
                "fechaInicio": "2026-08-01",
                "fechaFin": "2026-07-01",
                "objetivo": "Obj",
            },
            format="json",
        )
        self.assertEqual(respuesta.status_code, 400)
        self.assertIn("fechaFin", respuesta.data)

        respuesta_impacto = self.client.post(
            "/api/investigacion/impactos/",
            {
                "proyecto": self.proyecto.id,
                "descripcion": "Impacto",
                "nivelImpacto": 15,
                "fechaEvaluacion": "2026-06-01",
            },
            format="json",
        )
        self.assertEqual(respuesta_impacto.status_code, 400)
        self.assertIn("nivelImpacto", respuesta_impacto.data)

    def test_relaciones_y_cascadas(self):
        self.autenticar()

        respuesta_actor = self.client.post(
            f"/api/investigacion/proyectos/{self.proyecto.id}/actores/",
            {
                "nombre": "Actor API",
                "organizacion": "Organización API",
                "rol": "Líder",
                "contacto": "actor@api.test",
            },
            format="json",
        )
        self.assertEqual(respuesta_actor.status_code, 201)

        respuesta_evidencia = self.client.post(
            f"/api/investigacion/proyectos/{self.proyecto.id}/evidencias/",
            {
                "titulo": "Evidencia API",
                "descripcion": "Descripción evidencia",
                "fechaRegistro": "2026-05-20",
                "tipoEvidencia": "resultado",
                "recomendacion": "Seguir monitoreo",
            },
            format="json",
        )
        self.assertEqual(respuesta_evidencia.status_code, 201)

        respuesta_plan = self.client.post(
            f"/api/investigacion/proyectos/{self.proyecto.id}/planes-accion/",
            {
                "nombre": "Plan API",
                "descripcion": "Descripción plan",
                "fechaInicio": "2026-05-21",
                "fechaFin": "2026-06-21",
                "estado": "pendiente",
                "responsable": "Equipo API",
            },
            format="json",
        )
        self.assertEqual(respuesta_plan.status_code, 201)

        respuesta_impacto = self.client.post(
            f"/api/investigacion/proyectos/{self.proyecto.id}/impactos/",
            {
                "descripcion": "Impacto API",
                "nivelImpacto": 8,
                "fechaEvaluacion": "2026-06-22",
            },
            format="json",
        )
        self.assertEqual(respuesta_impacto.status_code, 201)

        self.assertEqual(self.proyecto.actores.count(), 1)
        self.assertEqual(self.proyecto.evidencias.count(), 1)
        self.assertEqual(self.proyecto.planes_accion.count(), 1)
        self.assertEqual(self.proyecto.impactos.count(), 1)

        self.proyecto.delete()
        self.assertEqual(Actor.objects.count(), 0)
        self.assertEqual(Evidencia.objects.count(), 0)
        self.assertEqual(PlanAccion.objects.count(), 0)
        self.assertEqual(Impacto.objects.count(), 0)
