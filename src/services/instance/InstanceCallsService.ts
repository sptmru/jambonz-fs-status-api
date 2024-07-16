import { RedisClient } from '../../infrastructure/redis/client';
import { config } from '../../infrastructure/config/config';
import { InstanceCallsData } from '../../domain/types/instance-calls/InstanceCallsData.type';
import { logger } from '../../misc/Logger';

export class InstanceCallsService {
  private static redisClient = RedisClient.getInstance().client;

  static async instanceExists(instanceId: string): Promise<boolean> {
    const instance = await this.redisClient.zScore(config.redis.instanceSet, instanceId);
    return instance !== null;
  }

  static async getInstanceCalls(instanceId: string): Promise<number> {
    logger.info(`Getting calls quantity for instance ${instanceId}`);
    const callsQuantity = await this.redisClient.zScore(config.redis.instanceSet, instanceId);
    if (callsQuantity === null) {
      await this.setInstanceCalls(instanceId, 0);
    }
    return callsQuantity === null ? 0 : Number(callsQuantity);
  }

  static async getAllInstancesSortedByCalls(): Promise<InstanceCallsData[]> {
    logger.info(`Getting all instances sorted by calls quantity`);
    const instances = await this.redisClient.zRangeWithScores(config.redis.instanceSet, 0, -1, {});
    return instances.map(instance => ({
      instanceId: instance.value,
      callsQuantity: instance.score,
    }));
  }

  static async setInstanceCalls(instanceId: string, callsQuantity: number): Promise<void> {
    logger.info(`Setting calls quantity for instance ${instanceId} to ${callsQuantity}`);
    await this.redisClient.zAdd(config.redis.instanceSet, {
      score: callsQuantity,
      value: instanceId,
    });
  }

  static async incrementInstanceCalls(instanceId: string): Promise<void> {
    logger.info(`Incrementing calls quantity for instance ${instanceId}`);
    await this.redisClient.zIncrBy(config.redis.instanceSet, 1, instanceId);
  }

  static async decrementInstanceCalls(instanceId: string): Promise<void> {
    logger.info(`Decrementing calls quantity for instance ${instanceId}`);
    const currentCallsQuantity = await this.getInstanceCalls(instanceId);
    switch (true) {
      case currentCallsQuantity === 0:
        logger.info(`Calls quantity for instance ${instanceId} is already 0`);
        return;
      case currentCallsQuantity < 0:
        logger.info(`Calls quantity for instance ${instanceId} is negative, setting to 0`);
        await this.setInstanceCalls(instanceId, 0);
        return;
      default:
        await this.redisClient.zIncrBy(config.redis.instanceSet, -1, instanceId);
        return;
    }
  }

  static async deleteInstanceData(instanceId: string): Promise<void> {
    logger.info(`Deleting instance ${instanceId} data`);
    await this.redisClient.zRem(config.redis.instanceSet, instanceId);
  }

  static async deleteAllInstancesData(): Promise<void> {
    logger.info(`Deleting all instances data`);
    await this.redisClient.del(config.redis.instanceSet);
  }
}
