#!/bin/sh

set -e
# if [ -z "${DJANGO_SECRET_KEY}" ];then
#   echo DJANGO_SECRET_KEY=$DJANGO_SECRET_KEY >> .env
# fi

# >&2 echo "Make Database migrations"
# python manage.py makemigrations app
# echo "-------------------------------------------------------------------------------------------\n"

# >&2 echo "Run Database migrations"
# python manage.py migrate
# echo "-------------------------------------------------------------------------------------------\n"

# >&2 echo "Creating superuser"
# python manage.py createsuperuser --noinput || true

# mkdir -p /code/app/build/static

# Collect static files
# >&2 echo "Collect static"
# python manage.py collectstatic --noinput

# >&2 echo "Start Celery workers"
# celery -A youtube_downloader worker -l INFO
# which celery

>&2 echo "Starting youtube-downloader..."
exec "$@"
