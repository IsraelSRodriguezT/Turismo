from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name='Clasificacion',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=255)),
                ('descripcion', models.TextField(blank=True)),
                ('nivel', models.CharField(choices=[('CATEGORIA', 'CATEGORIA'), ('TIPO', 'TIPO'), ('SUBTIPO', 'SUBTIPO')], default='CATEGORIA', max_length=20)),
            ],
            options={'ordering': ['nombre']},
        ),
        migrations.CreateModel(
            name='Servicio',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=255)),
                ('descripcion', models.TextField(blank=True)),
                ('esta_disponible', models.BooleanField(default=True)),
                ('costo', models.DecimalField(decimal_places=2, default=0, max_digits=10)),
            ],
            options={'ordering': ['nombre']},
        ),
        migrations.CreateModel(
            name='Recomendacion',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('descripcion', models.TextField()),
            ],
            options={'ordering': ['id']},
        ),
        migrations.CreateModel(
            name='Gerente',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=255)),
                ('apellido', models.CharField(max_length=255)),
                ('institucion', models.CharField(blank=True, max_length=255)),
                ('es_administrador_publico', models.BooleanField(default=False)),
                ('cargo', models.CharField(blank=True, max_length=255)),
            ],
            options={'ordering': ['apellido', 'nombre']},
        ),
        migrations.CreateModel(
            name='Horario',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('hora_inicio', models.TimeField()),
                ('hora_fin', models.TimeField()),
                ('tipo_horario', models.CharField(choices=[('NORMAL', 'NORMAL'), ('FIN_SEMANA', 'FIN DE SEMANA'), ('FERIADO', 'FERIADO'), ('ESPECIAL', 'ESPECIAL')], default='NORMAL', max_length=20)),
            ],
            options={'ordering': ['hora_inicio']},
        ),
        migrations.CreateModel(
            name='Ruta',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=255)),
                ('descripcion', models.TextField(blank=True)),
                ('distancia', models.FloatField(blank=True, null=True)),
                ('duracion', models.FloatField(blank=True, null=True)),
                ('nivel_dificultad', models.PositiveSmallIntegerField(default=1)),
                ('estado', models.CharField(choices=[('BUENA', 'BUENA'), ('REGULAR', 'REGULAR'), ('MALA', 'MALA'), ('CERRADA', 'CERRADA')], default='BUENA', max_length=20)),
            ],
            options={'ordering': ['nombre']},
        ),
        migrations.CreateModel(
            name='AtractivoTuristico',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=255)),
                ('descripcion', models.TextField(blank=True)),
                ('nivel_clasificacion', models.CharField(choices=[('CATEGORIA', 'CATEGORIA'), ('TIPO', 'TIPO'), ('SUBTIPO', 'SUBTIPO')], default='CATEGORIA', max_length=20)),
                ('nivel_accesibilidad', models.CharField(choices=[('LIBRE', 'LIBRE'), ('RESTRINGIDO', 'RESTRINGIDO'), ('PAGADO', 'PAGADO')], default='LIBRE', max_length=20)),
                ('estado_conservacion', models.CharField(choices=[('CONSERVADO', 'CONSERVADO'), ('ALTERADO', 'ALTERADO'), ('EN_DETERIORO', 'EN_DETERIORO'), ('DETERIORADO', 'DETERIORADO')], default='CONSERVADO', max_length=20)),
                ('estado_publicacion', models.CharField(choices=[('BORRADOR', 'BORRADOR'), ('REVISION', 'REVISION'), ('PUBLICADO', 'PUBLICADO'), ('ARCHIVADO', 'ARCHIVADO')], default='BORRADOR', max_length=20)),
                ('fecha_creacion', models.DateTimeField(auto_now_add=True)),
                ('fecha_actualizacion', models.DateTimeField(auto_now=True)),
                ('gerente', models.ForeignKey(blank=True, null=True, on_delete=models.SET_NULL, related_name='atractivos', to='atractivos.gerente')),
            ],
            options={'ordering': ['nombre']},
        ),
        migrations.CreateModel(
            name='Ubicacion',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('latitud', models.FloatField()),
                ('longitud', models.FloatField()),
                ('altitud', models.FloatField(blank=True, null=True)),
                ('canton', models.CharField(blank=True, max_length=128)),
                ('atractivo', models.OneToOneField(on_delete=models.CASCADE, related_name='ubicacion', to='atractivos.atractivoturistico')),
            ],
            options={'verbose_name': 'Ubicación', 'verbose_name_plural': 'Ubicaciones'},
        ),
        migrations.CreateModel(
            name='Direccion',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('calle_principal', models.CharField(max_length=255)),
                ('calle_transversal', models.CharField(blank=True, max_length=255)),
                ('numero', models.CharField(blank=True, max_length=32)),
                ('referencia', models.TextField(blank=True)),
                ('ubicacion', models.OneToOneField(on_delete=models.CASCADE, related_name='direccion', to='atractivos.ubicacion')),
            ],
            options={'verbose_name': 'Dirección', 'verbose_name_plural': 'Direcciones'},
        ),
        migrations.CreateModel(
            name='InformacionClimatica',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('clima', models.CharField(blank=True, max_length=128)),
                ('temperatura_minima', models.IntegerField(blank=True, null=True)),
                ('temperatura_maxima', models.IntegerField(blank=True, null=True)),
                ('temperatura_actual', models.FloatField(blank=True, null=True)),
                ('precipitacion_minima', models.IntegerField(blank=True, null=True)),
                ('precipitacion_maxima', models.IntegerField(blank=True, null=True)),
                ('ubicacion', models.OneToOneField(on_delete=models.CASCADE, related_name='informacion_climatica', to='atractivos.ubicacion')),
            ],
            options={'verbose_name': 'Información Climática', 'verbose_name_plural': 'Informaciones Climáticas'},
        ),
        migrations.CreateModel(
            name='DetalleRuta',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('orden', models.PositiveIntegerField(default=1)),
                ('atractivo', models.ForeignKey(on_delete=models.CASCADE, related_name='detalle_rutas', to='atractivos.atractivoturistico')),
                ('ruta', models.ForeignKey(on_delete=models.CASCADE, related_name='detalles', to='atractivos.ruta')),
            ],
            options={'ordering': ['orden'], 'unique_together': {('ruta', 'atractivo')}},
        ),
        migrations.AddField(
            model_name='atractivoturistico',
            name='clasificaciones',
            field=models.ManyToManyField(blank=True, related_name='atractivos', to='atractivos.clasificacion'),
        ),
        migrations.AddField(
            model_name='atractivoturistico',
            name='horarios',
            field=models.ManyToManyField(blank=True, related_name='atractivos', to='atractivos.horario'),
        ),
        migrations.AddField(
            model_name='atractivoturistico',
            name='recomendaciones',
            field=models.ManyToManyField(blank=True, related_name='atractivos', to='atractivos.recomendacion'),
        ),
        migrations.AddField(
            model_name='atractivoturistico',
            name='rutas',
            field=models.ManyToManyField(blank=True, related_name='atractivos', through='atractivos.DetalleRuta', to='atractivos.ruta'),
        ),
        migrations.AddField(
            model_name='atractivoturistico',
            name='servicios',
            field=models.ManyToManyField(blank=True, related_name='atractivos', to='atractivos.servicio'),
        ),
    ]
