# ============================================ base
# FROM python:3.10-slim-buster as base

# ENV PATH="/opt/venv/bin:/base:$PATH"

# COPY requirements.txt ./

# RUN set -ex; \
#         apt-get update; \
#         apt-get install -y --no-install-recommends \
#             build-essential \
#             ffmpeg \
#         ; \
#         python -m venv /opt/venv; \
#         pip install --upgrade pip; \
#         pip install -r requirements.txt;

# ============================================ webassets-builder

FROM node:lts-alpine as webassets-builder

WORKDIR /code/youtube

COPY youtube ./
RUN npm install
RUN npm run build

# ============================================ Release

FROM python:3.10-slim-buster AS release

ENV PYTHONUNBUFFERED 1
ENV PATH /code:/opt/venv/bin:$PATH

COPY requirements.txt ./

RUN set -ex; \
        apt-get update; \
        apt-get install -y --no-install-recommends \
            build-essential \
            ffmpeg \
        ; \
        python -m venv /opt/venv; \
        pip install --upgrade pip; \
        pip install -r requirements.txt;

WORKDIR /code
RUN mkdir -p /run/daphne

COPY manage.py supervisord.conf ./
COPY docker-entrypoint.sh /usr/local/bin

COPY --from=webassets-builder /code/youtube/static ./youtube/static

COPY playlistenerweb playlistenerweb/
COPY youtube youtube/
COPY home home/

RUN chmod +x /usr/local/bin/docker-entrypoint.sh


ENTRYPOINT ["docker-entrypoint.sh"]

CMD ["supervisord", "-c", "supervisord.conf", "-n"]

