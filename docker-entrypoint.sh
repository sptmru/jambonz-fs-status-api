#!/bin/bash

# Update .env
echo "Updating .env"
sed -i "s|LOG_LEVEL=debug|LOG_LEVEL=${LOG_LEVEL:-info}|" ./build/.env

sed -i "s|LOKI_ENABLED=false|LOKI_ENABLED=${LOKI_ENABLED:-false}|" ./build/.env
sed -i "s|LOKI_ENDPOINT=http://loki-gateway.jambonz.svc.cluster.local|LOKI_ENDPOINT=${LOKI_ENDPOINT:-http://loki-gateway.jambonz.svc.cluster.local}|" ./build/.env
sed -i "s|LOKI_LABEL_JOB=ivr-app|LOKI_LABEL_JOB=${LOKI_LABEL_JOB:-ivr-app}|" ./build/.env
sed -i "s|LOKI_JSON=false|LOKI_JSON=${LOKI_JSON:-false}|" ./build/.env
sed -i "s|LOKI_INTERVAL=5|LOKI_INTERVAL=${LOKI_INTERVAL:-5}|" ./build/.env
sed -i "s|LOKI_TIMEOUT=10000|LOKI_TIMEOUT=${LOKI_TIMEOUT:-10000}|" ./build/.env

sed -i "s|HTTP_HOSTNAME=http://localhost:8478|HTTP_HOSTNAME=${HTTP_HOSTNAME:-http://localhost:8478}|" ./build/.env
sed -i "s|HTTP_PORT=8478|HTTP_PORT=${HTTP_PORT:-8478}|" ./build/.env

sed -i "s|API_BASE_PREFIX=/api/v1|API_BASE_PREFIX=${API_BASE_PREFIX:-/api/v1}|" ./build/.env
sed -i "s|API_AUTH_TOKEN=secret|API_AUTH_TOKEN=${API_AUTH_TOKEN:-secret}|" ./build/.env

sed -i "s|REDIS_URI=redis://default:lnasdoifna0asd@redis:6379|REDIS_URI=${REDIS_URI:-redis://default:lnasdoifna0asd@redis:6379}|" ./build/.env
sed -i "s|REDIS_PASSWORD=lnasdoifna0asd|REDIS_PASSWORD=${REDIS_PASSWORD:-lnasdoifna0asd}|" ./build/.env

sed -i "s|FEATURE_SERVER_MAX_CALLS=1200|FEATURE_SERVER_MAX_CALLS=${FEATURE_SERVER_MAX_CALLS:-1200}|" ./build/.env

# Start service
echo "Starting app"
cd build && node app.js
