from django.db import models

class Mapa(models.Model):
    nombre = models.CharField(max_length=100)

    def __str__(self):
        return self.nombre

    class Meta:
        verbose_name = "Mapa"
        verbose_name_plural = "Mapas"

class Pais(models.Model):
    nombre = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.nombre

    class Meta:
        verbose_name = "País"
        verbose_name_plural = "Países"

class Provincia(models.Model):
    nombre = models.CharField(max_length=100)
    pais = models.ForeignKey(Pais, on_delete=models.CASCADE, related_name='provincias')

    def __str__(self):
        return f"{self.nombre} ({self.pais.nombre})"

    class Meta:
        verbose_name = "Provincia"
        verbose_name_plural = "Provincias"
        unique_together = ('nombre', 'pais')

class Canton(models.Model):
    nombre = models.CharField(max_length=100)
    provincia = models.ForeignKey(Provincia, on_delete=models.CASCADE, related_name='cantones')

    def __str__(self):
        return f"{self.nombre} ({self.provincia.nombre})"

    class Meta:
        verbose_name = "Cantón"
        verbose_name_plural = "Cantones"
        unique_together = ('nombre', 'provincia')

class Parroquia(models.Model):
    nombre = models.CharField(max_length=100)
    canton = models.ForeignKey(Canton, on_delete=models.CASCADE, related_name='parroquias')

    def __str__(self):
        return f"{self.nombre} ({self.canton.nombre})"

    class Meta:
        verbose_name = "Parroquia"
        verbose_name_plural = "Parroquias"
        unique_together = ('nombre', 'canton')

class Sector(models.Model):
    nombre = models.CharField(max_length=100)
    parroquia = models.ForeignKey(Parroquia, on_delete=models.CASCADE, related_name='sectores')

    def __str__(self):
        return f"{self.nombre} ({self.parroquia.nombre})"

    class Meta:
        verbose_name = "Sector"
        verbose_name_plural = "Sectores"
        unique_together = ('nombre', 'parroquia')
