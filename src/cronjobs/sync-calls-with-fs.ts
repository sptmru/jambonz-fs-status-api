import { CoreV1Api, KubeConfig } from '@kubernetes/client-node';

import { InstanceCallsService } from '../services/instance/InstanceCallsService';
import { config } from '../infrastructure/config/config';
import axios from 'axios';
import { logger } from '../misc/Logger';

logger.info(config.redis.uri);

void (async (): Promise<void> => {
  const kc = new KubeConfig();
  kc.loadFromDefault();

  const k8sApi = kc.makeApiClient(CoreV1Api);
  const namespace: string = 'jambonz';
  const serviceName = 'feature-server';

  try {
    const endpoints = await k8sApi.readNamespacedEndpoints(serviceName, namespace);
    if (endpoints.body.subsets !== undefined) {
      if (endpoints.body.subsets.length > 0) {
        const addresses = endpoints.body.subsets[0]?.addresses;
        if (addresses && addresses.length > 0) {
          for (const endpointData of addresses) {
            const ipAddr = endpointData.ip;
            const instance = await InstanceCallsService.getInstanceCalls(ipAddr);
            if (!instance) {
              await InstanceCallsService.setInstanceCalls(ipAddr, 0);
            }
          }
        }
      }
    }
  } catch (err) {
    logger.error(`sync-calls-with-fs: error fetching endpoints from k8s: ${err}`);
  }

  const instances = await InstanceCallsService.getAllInstancesSortedByCalls();

  for (const instance of instances) {
    const fsUrl = `http://${instance.instanceId}:${config.featureServer.port}`;
    try {
      const fsResponse = await axios.get(`${fsUrl}`, { timeout: 4000 });
      const calls = fsResponse.data?.calls;
      if (calls !== undefined) {
        logger.debug(`sync-calls-with-fs: updating calls for instance ${instance.instanceId}`);
        await InstanceCallsService.setInstanceCalls(instance.instanceId, calls);
      }
    } catch (error) {
      logger.debug(`sync-calls-with-fs: got error code ${error?.code} for ${instance.instanceId}`);
      if (
        error?.code === 'ENOTFOUND' ||
        error?.code === 'ETIMEDOUT' ||
        error?.code === 'ECONNREFUSED' ||
        error?.code === 'ECONNABORTED'
      ) {
        logger.debug(`sync-calls-with-fs: deleting instance ${instance.instanceId}`);
        await InstanceCallsService.deleteInstanceData(instance.instanceId);
      } else {
        logger.error(
          `sync-calls-with-fs: error updating calls for instance ${instance.instanceId}`,
          error
        );
      }
    }
  }
  process.exit(0);
})();
