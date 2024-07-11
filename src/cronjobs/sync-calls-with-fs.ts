import { InstanceCallsService } from '../services/instance/InstanceCallsService';
import { config } from '../infrastructure/config/config';
import axios from 'axios';
import { logger } from '../misc/Logger';

logger.info(config.redis.uri);

void (async (): Promise<void> => {
  const instances = await InstanceCallsService.getAllInstancesSortedByCalls();

  for (const instance of instances) {
    const fsUrl = `http://${instance.instanceId}:${config.featureServer.port}`;
    try {
      const fsResponse = await axios.get(`${fsUrl}`);
      const calls = fsResponse.data?.calls;
      if (calls !== undefined) {
        logger.debug(`sync-calls-with-fs: updating calls for instance ${instance.instanceId}`);
        await InstanceCallsService.setInstanceCalls(instance.instanceId, calls);
      }
    } catch (error) {
      if (error?.code === 'ENOTFOUND') {
        logger.debug(`sync-calls-with-fs: deleting instance ${instance.instanceId}`);
        await InstanceCallsService.deleteInstanceData(instance.instanceId);
      } else {
        logger.error(
          `sync-calls-with-fs: error updating calls for instance ${instance.instanceId}`,
          error
        );
      }
    }
    process.exit(0);
  }
})();
