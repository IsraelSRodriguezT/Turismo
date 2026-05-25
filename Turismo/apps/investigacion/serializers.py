from rest_framework import serializers
from .models import Actor, Evidencia, Impacto, PlanAccion, ProyectoInvestigacion, TipoEvidencia

class ActorSerializer(serializers.ModelSerializer):
    proyecto = serializers.PrimaryKeyRelatedField(required=False, read_only=False, queryset=ProyectoInvestigacion.objects.all())

    class Meta:
        model = Actor
        fields = ["id", "proyecto", "nombre", "apellido", "correo", "telefono", "organizacion"]
        read_only_fields = ["id"]

class EvidenciaSerializer(serializers.ModelSerializer):
    proyecto = serializers.PrimaryKeyRelatedField(required=False, read_only=False, queryset=ProyectoInvestigacion.objects.all())

    class Meta:
        model = Evidencia
        fields = ["id", "proyecto", "titulo", "descripcion", "fecha_registro", "tipo_evidencia", "recomendacion"]
        read_only_fields = ["id"]

class ImpactoSerializer(serializers.ModelSerializer):
    proyecto = serializers.PrimaryKeyRelatedField(required=False, read_only=False, queryset=ProyectoInvestigacion.objects.all())

    class Meta:
        model = Impacto
        fields = ["id", "proyecto", "descripcion", "nivel_impacto", "fecha_evaluacion"]
        read_only_fields = ["id"]

    def validate_nivel_impacto(self, value):
        if not (1 <= value <= 10):
            raise serializers.ValidationError("nivel_impacto debe estar entre 1 y 10")
        return value

class PlanAccionSerializer(serializers.ModelSerializer):
    proyecto = serializers.PrimaryKeyRelatedField(required=False, read_only=False, queryset=ProyectoInvestigacion.objects.all())

    class Meta:
        model = PlanAccion
        fields = ["id", "proyecto", "nombre", "descripcion", "fecha_inicio", "fecha_fin"]
        read_only_fields = ["id"]

    def validate(self, data):
        fecha_inicio = data.get("fecha_inicio")
        fecha_fin = data.get("fecha_fin")
        if fecha_inicio and fecha_fin and fecha_fin < fecha_inicio:
            raise serializers.ValidationError({"fecha_fin": "fecha_fin no puede ser anterior a fecha_inicio"})
        return data

class ProyectoInvestigacionSerializer(serializers.ModelSerializer):
    actores = ActorSerializer(many=True, read_only=True)
    evidencias = EvidenciaSerializer(many=True, read_only=True)
    impactos = ImpactoSerializer(many=True, read_only=True)
    planes_accion = PlanAccionSerializer(many=True, read_only=True)

    class Meta:
        model = ProyectoInvestigacion
        fields = ["id", "titulo", "descripcion", "fecha_inicio", "fecha_fin", "objetivo", "sector", "actores", "evidencias", "impactos", "planes_accion"]
        read_only_fields = ["id"]

    def validate(self, data):
        fecha_inicio = data.get("fecha_inicio")
        fecha_fin = data.get("fecha_fin")
        if fecha_inicio and fecha_fin and fecha_fin < fecha_inicio:
            raise serializers.ValidationError({"fecha_fin": "fecha_fin no puede ser anterior a fecha_inicio"})
        return data
