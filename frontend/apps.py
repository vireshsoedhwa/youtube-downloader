from django.apps import AppConfig
from django.conf import settings

class FrontendConfig(AppConfig):
    name = 'frontend'
    def ready(self):
        print("DEBUG: " + str(settings.DEBUG))
        print("PRODUCTION: " + str(settings.PRODUCTION))
        # print("DJANGO_SECRET_KEY: " + str(settings.SECRET_KEY))
        print("frontend started")
