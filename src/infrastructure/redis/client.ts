import { RedisFunctions, RedisModules, RedisScripts, createClient, RedisClientType } from 'redis';
import { logger } from '../../misc/Logger';
import { config } from '../config/config';

export class RedisClient {
  public static instance: RedisClient | null = null;
  public client: RedisClientType<RedisModules, RedisFunctions, RedisScripts>;

  private constructor() {
    this.client = createClient({ url: config.redis.uri });

    this.client.on('connect', () => {
      logger.info(`Redis connection (re)established`);
    });

    this.client.on('error', error => {
      if (error instanceof AggregateError) {
        error.errors.forEach(err => {
          logger.error(`Redis connection error: ${err}`);
        });
      } else {
        logger.error(`Redis connection error: ${error}`);
      }
    });

    this.client.on('end', () => {
      logger.info(`Redis connection closed`);
    });

    void this.client.connect();
  }

  public static getInstance(): RedisClient {
    if (this.instance === null) {
      this.instance = new RedisClient();
    }

    return this.instance;
  }
}
