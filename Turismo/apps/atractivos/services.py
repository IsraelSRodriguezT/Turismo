from apps.atractivos.models import (
    AtractivoTuristico,
    DetalleRuta,
    Direccion,
    Horario,
    InformacionClimatica,
    Ruta,
    Ubicacion,
)


class AtractivoService:
    @staticmethod
    def _update_m2m(instance, field_name, values):
        if values is not None:
            getattr(instance, field_name).set(values)

    @staticmethod
    def _sync_rutas(instance, rutas):
        if rutas is None:
            return
        DetalleRuta.objects.filter(atractivo=instance).delete()
        for orden, ruta in enumerate(rutas, start=1):
            DetalleRuta.objects.create(ruta=ruta, atractivo=instance, orden=orden)

    @staticmethod
    def _create_ubicacion(instance, ubicacion_data):
        if not ubicacion_data:
            return None
        direccion_data = ubicacion_data.pop('direccion', None)
        climatica_data = ubicacion_data.pop('informacion_climatica', None)
        ubicacion = Ubicacion.objects.create(atractivo=instance, **ubicacion_data)
        if direccion_data:
            Direccion.objects.create(ubicacion=ubicacion, **direccion_data)
        if climatica_data:
            InformacionClimatica.objects.create(ubicacion=ubicacion, **climatica_data)
        return ubicacion

    @staticmethod
    def _update_ubicacion(instance, ubicacion_data):
        if ubicacion_data is None:
            return
        direccion_data = ubicacion_data.pop('direccion', None)
        climatica_data = ubicacion_data.pop('informacion_climatica', None)
        ubicacion, _ = Ubicacion.objects.get_or_create(atractivo=instance)
        for attr, value in ubicacion_data.items():
            setattr(ubicacion, attr, value)
        ubicacion.save()

        if direccion_data is not None:
            direccion, _ = Direccion.objects.get_or_create(ubicacion=ubicacion)
            for attr, value in direccion_data.items():
                setattr(direccion, attr, value)
            direccion.save()

        if climatica_data is not None:
            clima, _ = InformacionClimatica.objects.get_or_create(ubicacion=ubicacion)
            for attr, value in climatica_data.items():
                setattr(clima, attr, value)
            clima.save()

    @classmethod
    def create_atractivo(cls, validated_data):
        ubicacion_data = validated_data.pop('ubicacion', None)
        rutas = validated_data.pop('rutas', None)
        clasificaciones = validated_data.pop('clasificaciones', None)
        servicios = validated_data.pop('servicios', None)
        recomendaciones = validated_data.pop('recomendaciones', None)
        horarios = validated_data.pop('horarios', None)

        atractivo = AtractivoTuristico.objects.create(**validated_data)
        cls._create_ubicacion(atractivo, ubicacion_data)
        cls._update_m2m(atractivo, 'clasificaciones', clasificaciones)
        cls._update_m2m(atractivo, 'servicios', servicios)
        cls._update_m2m(atractivo, 'recomendaciones', recomendaciones)
        cls._update_m2m(atractivo, 'horarios', horarios)
        cls._sync_rutas(atractivo, rutas)
        return atractivo

    @classmethod
    def update_atractivo(cls, instance, validated_data):
        ubicacion_data = validated_data.pop('ubicacion', None)
        rutas = validated_data.pop('rutas', None)
        clasificaciones = validated_data.pop('clasificaciones', None)
        servicios = validated_data.pop('servicios', None)
        recomendaciones = validated_data.pop('recomendaciones', None)
        horarios = validated_data.pop('horarios', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        cls._update_ubicacion(instance, ubicacion_data)
        cls._update_m2m(instance, 'clasificaciones', clasificaciones)
        cls._update_m2m(instance, 'servicios', servicios)
        cls._update_m2m(instance, 'recomendaciones', recomendaciones)
        cls._update_m2m(instance, 'horarios', horarios)
        cls._sync_rutas(instance, rutas)
        return instance

    @staticmethod
    def list_atractivos(filters=None):
        queryset = AtractivoTuristico.objects.all()
        if not filters:
            return queryset

        if 'clasificacion' in filters and filters['clasificacion']:
            queryset = queryset.filter(clasificaciones__id=filters['clasificacion'])
        if 'estado_conservacion' in filters and filters['estado_conservacion']:
            queryset = queryset.filter(estado_conservacion=filters['estado_conservacion'])
        if 'nivel_accesibilidad' in filters and filters['nivel_accesibilidad']:
            queryset = queryset.filter(nivel_accesibilidad=filters['nivel_accesibilidad'])
        if 'canton' in filters and filters['canton']:
            queryset = queryset.filter(ubicacion__canton__iexact=filters['canton'])
        return queryset.distinct()
