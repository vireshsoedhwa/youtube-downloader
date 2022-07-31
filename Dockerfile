# ============================================ base
FROM python:3.10-slim-buster as base

ENV PATH="/opt/venv/bin:/base:$PATH"

COPY requirements.txt ./

RUN set -ex; \
        apt-get update; \
        apt-get install -y --no-install-recommends \
            build-essential \
            gcc \
        ; \
        \
        python -m venv /opt/venv; \
        \
        pip install --upgrade pip; \
        pip install -r requirements.txt;

# ============================================ frontend-builder

FROM node:lts-alpine as frontend-builder

WORKDIR /code

COPY frontend ./

RUN npm install
RUN npm run build

# ============================================ Release

FROM python:3.10-alpine AS release

ENV PYTHONUNBUFFERED 1
ENV PATH /code:/opt/venv/bin:$PATH

WORKDIR /code
RUN mkdir -p /run/daphne

COPY manage.py supervisord.conf ./
COPY docker-entrypoint.sh /usr/local/bin

COPY --from=base /root/.cache /root/.cache
COPY --from=base /opt/venv /opt/venv

COPY --from=frontend-builder /code/static ./frontend/static

COPY playlistenerweb playlistenerweb/
COPY frontend frontend/

RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENTRYPOINT ["docker-entrypoint.sh"]

CMD ["supervisord", "-c", "supervisord.conf", "-n"]

