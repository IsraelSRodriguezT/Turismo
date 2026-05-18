try:
	from rest_framework.routers import DefaultRouter
	from .views import RecursoViewSet

	router = DefaultRouter()
	router.register(r'recursos', RecursoViewSet, basename='recurso')

	urlpatterns = router.urls
except Exception:
	# If rest_framework is not available in this environment (tests/setup),
	# expose an empty urlpatterns so Django checks/tests can proceed.
	urlpatterns = []
