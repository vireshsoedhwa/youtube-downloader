from django.apps import AppConfig
from django.conf import settings

import logging
logger = logging.getLogger(__name__)

class ApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api'

    def ready(self):
        if settings.DEBUG:
            logger.info("started DEV")
        else:
            logger.info("started PRODUCTION")