import * as dotenv from 'dotenv';

const parsedConfig = dotenv.config().parsed;

export const config = {
  log: {
    level: parsedConfig?.LOG_LEVEL != null ? parsedConfig.LOG_LEVEL : 'debug',
    directory: parsedConfig?.LOG_DIRECTORY != null ? parsedConfig.LOG_DIRECTORY : './logs',
    file: `${parsedConfig?.LOG_LEVEL != null ? parsedConfig.LOG_LEVEL : 'debug'}.log`,
    logToFile:
      parsedConfig?.LOG_TO_FILE != null ? parsedConfig.LOG_TO_FILE.toLowerCase() === 'true' : false,
  },
  loki: {
    enabled:
      parsedConfig?.LOKI_ENABLED != null
        ? parsedConfig.LOKI_ENABLED.toLowerCase() === 'true'
        : false,
    host:
      parsedConfig?.LOKI_ENDPOINT != null
        ? parsedConfig.LOKI_ENDPOINT
        : 'http://loki-gateway.jambonz.svc.cluster.local',
    labels: {
      job: parsedConfig?.LOKI_LABEL_JOB != null ? parsedConfig.LOKI_LABEL_JOB : 'fs-status-api',
    },
    json: parsedConfig?.LOKI_JSON != null ? parsedConfig.LOKI_JSON.toLowerCase() === 'true' : false,
    interval: parsedConfig?.LOKI_INTERVAL != null ? Number(parsedConfig.LOKI_INTERVAL) : 5,
    timeout: parsedConfig?.LOKI_TIMEOUT != null ? Number(parsedConfig.LOKI_TIMEOUT) : 10000,
  },
  api: {
    port: parsedConfig?.HTTP_PORT != null ? Number(parsedConfig.HTTP_PORT) : 3000,
    hostname: parsedConfig?.HTTP_HOSTNAME != null ? parsedConfig.HTTP_HOSTNAME : 'http://localhost',
    basePrefix: parsedConfig?.API_BASE_PREFIX != null ? parsedConfig.API_BASE_PREFIX : '/api/v1',
    authToken: parsedConfig?.API_AUTH_TOKEN != null ? parsedConfig.API_AUTH_TOKEN : 'secret',
  },
  redis: {
    uri:
      parsedConfig?.REDIS_URI != null
        ? parsedConfig.REDIS_URI
        : 'redis://default:lnasdoifna0asd@localhost:6379',
    instanceSet:
      parsedConfig?.REDIS_INSTANCE_SET != null ? parsedConfig.REDIS_INSTANCE_SET : 'instances',
  },
  featureServer: {
    port:
      parsedConfig?.FEATURE_SERVER_PORT != null ? Number(parsedConfig.FEATURE_SERVER_PORT) : 3000,
    maxCalls:
      parsedConfig?.FEATURE_SERVER_MAX_CALLS != null
        ? Number(parsedConfig.FEATURE_SERVER_MAX_CALLS)
        : 1200,
  },
};
