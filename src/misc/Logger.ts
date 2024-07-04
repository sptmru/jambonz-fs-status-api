import * as winston from 'winston';
import LokiTransport from 'winston-loki';

import { config } from '../infrastructure/config/config';
import { ConsoleTransportInstance, FileTransportInstance } from 'winston/lib/winston/transports';

type TransportUnion = LokiTransport | FileTransportInstance | ConsoleTransportInstance;

const consoleLogFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
);

const fileLogFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
);

const lokiOptions = {
  host: config.loki.host,
  labels: config.loki.labels,
  json: config.loki.json,
  format: winston.format.json(),
  interval: config.loki.interval,
  timeout: config.loki.timeout,
  onConnectionError: (err: Error): void => {
    console.error(err);
  },
};

const transportListWithFile: TransportUnion[] = [
  new winston.transports.Console({ format: consoleLogFormat }),
  new winston.transports.File({ filename: `${config.log.directory}/${config.log.file}`, format: fileLogFormat }),
];

const transportListWithoutFile: TransportUnion[] = [
  new winston.transports.Console({ format: consoleLogFormat }) as ConsoleTransportInstance,
];

if (config.loki.enabled) {
  transportListWithFile.push(new LokiTransport(lokiOptions));
  transportListWithoutFile.push(new LokiTransport(lokiOptions));
}

const logger = winston.createLogger({
  level: config.log.level,
  defaultMeta: {},
  transports: config.log.logToFile ? transportListWithFile : transportListWithoutFile,
});

export { logger };
