from rest_framework import serializers
from .models import ProyectoInvestigacion, Evidencia, Impacto, Actor, PlanAccion, TipoEvidencia


class ActorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Actor
        fields = ["id", "nombre", "organizacion", "rol", "contacto"]
        read_only_fields = ["id"]


class EvidenciaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Evidencia
        fields = ["id", "titulo", "descripcion", "fechaRegistro", "tipoEvidencia", "recomendacion", "archivo", "created_at"]
        read_only_fields = ["id", "created_at"]


class ImpactoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Impacto
        fields = ["id", "descripcion", "nivelImpacto", "fechaEvaluacion", "created_at"]
        read_only_fields = ["id", "created_at"]

    def validate_nivelImpacto(self, value):
        if not (1 <= value <= 10):
            raise serializers.ValidationError("nivelImpacto debe estar entre 1 y 10")
        return value


class PlanAccionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlanAccion
        fields = ["id", "nombre", "descripcion", "fechaInicio", "fechaFin", "estado", "responsable", "created_at"]
        read_only_fields = ["id", "created_at"]

    def validate(self, data):
        fechaInicio = data.get("fechaInicio")
        fechaFin = data.get("fechaFin")
        if fechaInicio and fechaFin and fechaFin < fechaInicio:
            raise serializers.ValidationError({"fechaFin": "fechaFin no puede ser anterior a fechaInicio"})
        return data


class ProyectoInvestigacionSerializer(serializers.ModelSerializer):
    actores = ActorSerializer(many=True, read_only=True)
    evidencias = EvidenciaSerializer(many=True, read_only=True)
    impactos = ImpactoSerializer(many=True, read_only=True)
    planes_accion = PlanAccionSerializer(many=True, read_only=True)

    class Meta:
        model = ProyectoInvestigacion
        fields = [
            "id",
            "titulo",
            "descripcion",
            "fechaInicio",
            "fechaFin",
            "objetivo",
            "estado",
            "responsable",
            "created_at",
            "updated_at",
            "actores",
            "evidencias",
            "impactos",
            "planes_accion",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def validate(self, data):
        fechaInicio = data.get("fechaInicio")
        fechaFin = data.get("fechaFin")
        if fechaInicio and fechaFin and fechaFin < fechaInicio:
            raise serializers.ValidationError({"fechaFin": "fechaFin no puede ser anterior a fechaInicio"})
        return data
