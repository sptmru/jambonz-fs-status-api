import { RedisClient } from '../../infrastructure/redis/client';
import { config } from '../../infrastructure/config/config';

export class InstanceCallsService {
  static async getInstanceCalls(instanceId: string): Promise<number> {
    const callsQuantity = await RedisClient.getInstance().client.get(instanceId);
    return callsQuantity === null ? config.featureServer.maxCalls + 1 : Number(callsQuantity);
  }

  static async setInstanceCalls(instanceId: string, callsQuantity: number): Promise<void> {
    await RedisClient.getInstance().client.set(instanceId, callsQuantity.toString());
  }

  static async incrementInstanceCalls(instanceId: string): Promise<void> {
    await RedisClient.getInstance().client.incr(instanceId);
  }

  static async decrementInstanceCalls(instanceId: string): Promise<void> {
    await RedisClient.getInstance().client.decr(instanceId);
  }

  static async deleteInstanceData(instanceId: string): Promise<void> {
    await RedisClient.getInstance().client.del(instanceId);
  }
}
