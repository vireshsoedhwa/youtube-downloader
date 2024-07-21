from django.contrib import admin

# Register your models here.

from .models import YoutubeResource, Session
admin.site.site_header = "PLWEB Admin"
admin.site.site_title = "PLWEB site admin"
admin.site.register(YoutubeResource)
admin.site.register(Session)