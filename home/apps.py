from django.apps import AppConfig
from django.conf import settings

class HomeConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'home'
    def ready(self):
        print("DEBUG: " + str(settings.DEBUG))
        print("PRODUCTION: " + str(settings.PRODUCTION))
        print("GO_PIPELINE_LABEL: " + str(settings.GO_PIPELINE_LABEL))
        print("Home started")