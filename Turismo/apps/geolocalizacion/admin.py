from django.contrib import admin
from .models import Mapa, Pais, Provincia, Canton, Parroquia, Sector

@admin.register(Mapa)
class MapaAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'canton')
    search_fields = ('nombre', 'canton__nombre')

@admin.register(Pais)
class PaisAdmin(admin.ModelAdmin):
    list_display = ('nombre',)
    search_fields = ('nombre',)

@admin.register(Provincia)
class ProvinciaAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'pais')
    list_filter = ('pais',)
    search_fields = ('nombre', 'pais__nombre')

@admin.register(Canton)
class CantonAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'provincia')
    list_filter = ('provincia',)
    search_fields = ('nombre', 'provincia__nombre')

@admin.register(Parroquia)
class ParroquiaAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'canton')
    list_filter = ('canton',)
    search_fields = ('nombre', 'canton__nombre')

@admin.register(Sector)
class SectorAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'parroquia')
    list_filter = ('parroquia',)
    search_fields = ('nombre', 'parroquia__nombre')
