from django.shortcuts import render
from django.views.decorators.csrf import ensure_csrf_cookie
from django.conf import settings

@ensure_csrf_cookie
def index(request):

    if request.session.test_cookie_worked():
        print(str(request.headers['Cookie']))

    request.session.set_test_cookie()

    context = {
        'version':  settings.GO_PIPELINE_LABEL,
    }

    return render(request, 'home/index.html', context)