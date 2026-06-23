try:
	from rest_framework.routers import DefaultRouter
	from .views import PublicacionViewSet, RecursoViewSet

	router = DefaultRouter()
	router.register(r'recursos', RecursoViewSet, basename='recurso')
	router.register(r'publicaciones', PublicacionViewSet, basename='publicacion')

	urlpatterns = router.urls
except Exception:
	urlpatterns = []
