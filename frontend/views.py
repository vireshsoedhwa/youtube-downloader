from django.shortcuts import render
from django.views.decorators.csrf import ensure_csrf_cookie
from rest_framework.views import APIView
from rest_framework.response import Response
import json

from django.conf import settings

@ensure_csrf_cookie
def index(request):

    if request.session.test_cookie_worked():
        print(str(request.headers['Cookie']))

    request.session.set_test_cookie()

    context = {
        'version':  settings.GO_PIPELINE_LABEL,
    }

    return render(request, 'frontend/index.html', context)



class ListMedia(APIView):
    def get(self, format=None):

        json_loaded = json.loads('[{"id":6,"title":"Coldplay - Viva La Vida (Anton Corbijn Version)","genre":null,"audiofile":"/code/data/6/Coldplay_-_Viva_La_Vida_Anton_Corbijn_Version.mp3","youtube_data":{"youtube_id":"1kVxpsi1XQ4","download_finished":true,"busy":false,"downloadprogress":"100","eta":"0","elapsed":"63","speed":"63876"},"created_at":"2022-08-02T03:09:30.364142Z"},{"id":5,"title":"Coldplay - Viva La Vida (Official Video)","genre":null,"audiofile":"/code/data/5/Coldplay_-_Viva_La_Vida_Official_Video.mp3","youtube_data":{"youtube_id":"dvgZkm1xWPE","download_finished":true,"busy":false,"downloadprogress":"100","eta":"0","elapsed":"55","speed":"71962"},"created_at":"2022-08-02T02:35:37.653656Z"},{"id":4,"title":"Rema - Calm Down (Lyrics/Letras)","genre":null,"audiofile":"/code/data/4/Rema_-_Calm_Down_Lyrics_Letras.mp3","youtube_data":{"youtube_id":"m0qFZu6CFYQ","download_finished":true,"busy":false,"downloadprogress":"100","eta":"0","elapsed":"85","speed":"55098"},"created_at":"2022-07-31T01:49:58.231684Z"},{"id":3,"title":"CKay - Love Nwantiti Remix ft. Joeboy & Kuami Eugene [Ah Ah Ah] [Official Music Video]","genre":null,"audiofile":"/code/data/3/CKay_-_Love_Nwantiti_Remix_ft._Joeboy_Kuami_Eugene_Ah_Ah_Ah_Official_Music_Video.mp3","youtube_data":{"youtube_id":"D-YDEyuDxWU","download_finished":true,"busy":false,"downloadprogress":"100","eta":"0","elapsed":"59","speed":"53844"},"created_at":"2022-07-31T01:35:44.139976Z"},{"id":2,"title":"Spirit Lead Me - Hillsong United (Lyrics)","genre":null,"audiofile":"/code/data/2/Spirit_Lead_Me_-_Hillsong_United_Lyrics.mp3","youtube_data":{"youtube_id":"CHAAfC6gjnw","download_finished":true,"busy":false,"downloadprogress":"100","eta":"0","elapsed":"58","speed":"74962"},"created_at":"2022-07-30T15:33:36.792109Z"},{"id":1,"title":"AURORA - Runaway","genre":null,"audiofile":"/code/data/1/AURORA_-_Runaway.mp3","youtube_data":{"youtube_id":"d_HlPboLRL8","download_finished":true,"busy":false,"downloadprogress":"100","eta":"0","elapsed":"58","speed":"74959"},"created_at":"2022-07-30T15:32:03.426021Z"}]')
        # import time
        # time.sleep(5)
        
        return Response(json_loaded)