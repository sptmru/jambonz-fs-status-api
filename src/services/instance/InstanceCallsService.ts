import { RedisClient } from '../../infrastructure/redis/client';
import { config } from '../../infrastructure/config/config';
import { InstanceCallsData } from '../../domain/types/instance-calls/InstanceCallsData.type';

export class InstanceCallsService {
  private static redisClient = RedisClient.getInstance().client;

  static async getInstanceCalls(instanceId: string): Promise<number> {
    const callsQuantity = await this.redisClient.zScore(config.redis.instanceSet, instanceId);
    if (callsQuantity === null) {
      await this.setInstanceCalls(instanceId, 0);
    }
    return callsQuantity === null ? 0 : Number(callsQuantity);
  }

  static async getAllInstancesSortedByCalls(): Promise<InstanceCallsData[]> {
    const instances = await this.redisClient.zRangeWithScores(config.redis.instanceSet, 0, -1, {});
    return instances.map(instance => ({
      instanceId: instance.value,
      callsQuantity: instance.score,
    }));
  }

  static async setInstanceCalls(instanceId: string, callsQuantity: number): Promise<void> {
    await this.redisClient.zAdd(config.redis.instanceSet, {
      score: callsQuantity,
      value: instanceId,
    });
  }

  static async incrementInstanceCalls(instanceId: string): Promise<void> {
    await this.redisClient.zIncrBy(config.redis.instanceSet, 1, instanceId);
  }

  static async decrementInstanceCalls(instanceId: string): Promise<void> {
    await this.redisClient.zIncrBy(config.redis.instanceSet, -1, instanceId);
  }

  static async deleteInstanceData(instanceId: string): Promise<void> {
    await this.redisClient.del(instanceId);
  }
}
