from .models import Pais, Provincia, Canton, Parroquia, Sector

class GeolocalizacionService:
    @staticmethod
    def crear_pais(nombre):
        return Pais.objects.create(nombre=nombre)

    @staticmethod
    def obtener_paises():
        return Pais.objects.all()

    @staticmethod
    def crear_provincia(nombre, pais_id):
        pais = Pais.objects.get(id=pais_id)
        return Provincia.objects.create(nombre=nombre, pais=pais)

    @staticmethod
    def obtener_provincias_por_pais(pais_id):
        return Provincia.objects.filter(pais_id=pais_id)

    @staticmethod
    def crear_canton(nombre, provincia_id):
        provincia = Provincia.objects.get(id=provincia_id)
        return Canton.objects.create(nombre=nombre, provincia=provincia)

    @staticmethod
    def obtener_cantones_por_provincia(provincia_id):
        return Canton.objects.filter(provincia_id=provincia_id)

    @staticmethod
    def crear_parroquia(nombre, canton_id):
        canton = Canton.objects.get(id=canton_id)
        return Parroquia.objects.create(nombre=nombre, canton=canton)

    @staticmethod
    def obtener_parroquias_por_canton(canton_id):
        return Parroquia.objects.filter(canton_id=canton_id)

    @staticmethod
    def crear_sector(nombre, parroquia_id):
        parroquia = Parroquia.objects.get(id=parroquia_id)
        return Sector.objects.create(nombre=nombre, parroquia=parroquia)

    @staticmethod
    def obtener_sectores_por_parroquia(parroquia_id):
        return Sector.objects.filter(parroquia_id=parroquia_id)

    @staticmethod
    def obtener_jerarquia_geografica():
        """
        Retorna la jerarquía completa: País -> Provincia -> Cantón -> Parroquia -> Sector
        """
        paises = Pais.objects.prefetch_related(
            'provincias__cantones__parroquias__sectores'
        ).all()
        return paises