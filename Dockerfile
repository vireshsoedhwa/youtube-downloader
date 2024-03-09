FROM python:3.10-slim-buster as base
ENV PYTHONUNBUFFERED 1
ENV PATH /code:/opt/venv/bin:$PATH
COPY requirements.txt ./
RUN set -ex; \
        python -m venv /opt/venv; \
        pip install --upgrade pip; \
        pip install -r requirements.txt;

# ============================================ WEB ASSETS BUILDER

FROM node:19.4.0 as webassets-builder

WORKDIR /app

COPY app .
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
            curl; 

COPY --from=webassets-builder /app/build ./app/build
COPY --from=base /root/.cache /root/.cache
COPY --from=base /opt/venv /opt/venv

COPY manage.py ./
COPY docker-entrypoint.sh /usr/local/bin

COPY youtube_downloader youtube_downloader/
COPY app app

RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENTRYPOINT ["docker-entrypoint.sh"]

CMD ["gunicorn", "-w", "2", "-b", "0.0.0.0:9000", "--forwarded-allow-ips=*", "--log-level", "info", "youtube_downloader.wsgi"]
