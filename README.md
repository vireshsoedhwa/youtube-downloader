# playlistener-web

Dev:
    
    docker compose up

Prod:

    docker compose -f compose.yml -f compose.prod.yml up -d
    
# create secrets:
    
## App

    kubectl create secret generic app-secret --namespace plweb --from-literal=ADMIN_USERNAME=admin --from-literal=ADMIN_PASSWORD=admin --from-literal=DJANGO_SECRET_KEY=WOOOOOOOOWOOOOOOOOWWW

## DB
    kubectl create secret generic postgressecret --namespace plweb --from-literal=POSTGRES_USER=postgres --from-literal=POSTGRES_PASSWORD=admin



## The following ENV Variables need to be set for prod:
DJANGO_SECRET_KEY=WOOOOOOOOWOOOOOOOOWWW
POSTGRES_HOST=db
POSTGRES_PASSWORD=postgres
POSTGRES_DB=postgres
POSTGRES_USER=postgres
