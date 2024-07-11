#!/bin/bash

# Update .env
echo "Updating .env"
sed -i "s|LOG_LEVEL=debug|LOG_LEVEL=${LOG_LEVEL:-info}|" .env

sed -i "s|LOKI_ENABLED=false|LOKI_ENABLED=${LOKI_ENABLED:-false}|" .env
sed -i "s|LOKI_ENDPOINT=http://loki-gateway.jambonz.svc.cluster.local|LOKI_ENDPOINT=${LOKI_ENDPOINT:-http://loki-gateway.jambonz.svc.cluster.local}|" .env
sed -i "s|LOKI_LABEL_JOB=ivr-app|LOKI_LABEL_JOB=${LOKI_LABEL_JOB:-ivr-app}|" .env
sed -i "s|LOKI_JSON=false|LOKI_JSON=${LOKI_JSON:-false}|" .env
sed -i "s|LOKI_INTERVAL=5|LOKI_INTERVAL=${LOKI_INTERVAL:-5}|" .env
sed -i "s|LOKI_TIMEOUT=10000|LOKI_TIMEOUT=${LOKI_TIMEOUT:-10000}|" .env

sed -i "s|HTTP_HOSTNAME=http://localhost:8478|HTTP_HOSTNAME=${HTTP_HOSTNAME:-http://localhost:8478}|" .env
sed -i "s|HTTP_PORT=8478|HTTP_PORT=${HTTP_PORT:-8478}|" .env

sed -i "s|API_BASE_PREFIX=/api/v1|API_BASE_PREFIX=${API_BASE_PREFIX:-/api/v1}|" .env
sed -i "s|API_AUTH_TOKEN=secret|API_AUTH_TOKEN=${API_AUTH_TOKEN:-secret}|" .env

sed -i "s|REDIS_URI=redis://:lnasdoifna0asd@localhost:6379|REDIS_URI=${REDIS_URI:-redis://:lnasdoifna0asd@localhost:6379}|" .env
sed -i "s|REDIS_PASSWORD=lnasdoifna0asd|REDIS_PASSWORD=${REDIS_PASSWORD:-lnasdoifna0asd}|" .env
sed -i "s|REDIS_INSTANCE_SET=instances|REDIS_INSTANCE_SET=${REDIS_INSTANCE_SET:-instances}|" .env

sed -i "s|FEATURE_SERVER_MAX_CALLS=1200|FEATURE_SERVER_MAX_CALLS=${FEATURE_SERVER_MAX_CALLS:-1200}|" .env
sed -i "s|FEATURE_SERVER_PORT=3000|FEATURE_SERVER_PORT=${FEATURE_SERVER_PORT:-3000}|" .env

# Start service
echo "Starting cronjob"
npm run start:sync-calls-with-fs
