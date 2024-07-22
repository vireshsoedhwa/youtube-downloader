FROM python:3.10-slim-buster as base
ENV PYTHONUNBUFFERED 1
ENV PATH /code:/opt/venv/bin:$PATH
COPY requirements.txt ./
RUN set -ex; \
        python -m venv /opt/venv; \
        pip install --upgrade pip; \
        pip install -r requirements.txt;

# ============================================ WEB ASSETS BUILDER

FROM node:21.6.1 as webassets-builder

WORKDIR /app

COPY frontend .
RUN npm install
RUN npm run build

# ============================================ Release

FROM python:3.10-slim-buster AS release
ENV PYTHONUNBUFFERED 1
ENV PATH /code:/opt/venv/bin:$PATH
WORKDIR /code
ARG VERSION
ENV VERSION=${VERSION:-1.0.0}
RUN echo $VERSION > .env

RUN set -ex; \
        apt-get update; \
        apt-get install -y --no-install-recommends \
            ffmpeg \
            curl \ 
            gpg;
        # mkdir -p /etc/apt/keyrings; \
        # curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key | gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg; \
        # echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_20.x nodistro main" | tee /etc/apt/sources.list.d/nodesource.list; \
        # apt-get update && apt-get install -y nodejs;
        

COPY frontend/src ./frontend/src
COPY frontend/apps.py ./frontend/apps.py
COPY frontend/urls.py ./frontend/urls.py
COPY frontend/views.py ./frontend/views.py

COPY frontend/templates ./frontend/templates
COPY --from=webassets-builder /app/dist ./frontend/dist

COPY --from=base /root/.cache /root/.cache
COPY --from=base /opt/venv /opt/venv

COPY manage.py ./
COPY docker-entrypoint.sh /usr/local/bin

COPY youtube_downloader youtube_downloader/
COPY api api

RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENTRYPOINT ["docker-entrypoint.sh"]

CMD ["gunicorn", "-w", "2", "-b", "0.0.0.0:9000", "--forwarded-allow-ips=*", "--log-level", "info", "youtube_downloader.wsgi"]
