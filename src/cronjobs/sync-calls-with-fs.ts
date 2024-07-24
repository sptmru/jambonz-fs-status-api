/* eslint-disable */

import { CoreV1Api, KubeConfig, Exec } from '@kubernetes/client-node';
import { InstanceCallsService } from '../services/instance/InstanceCallsService';
import { config } from '../infrastructure/config/config';
import { logger } from '../misc/Logger';

logger.info(config.redis.uri);

const execCommand = async (
  namespace: string,
  podName: string,
  containerName: string,
  command: string[]
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const kc = new KubeConfig();
    kc.loadFromDefault();
    const exec = new Exec(kc);
    const stream = require('stream');
    const stdout = new stream.PassThrough();
    const stderr = new stream.PassThrough();
    let result = '';

    stdout.on('data', data => {
      result += data.toString();
    });

    stderr.on('data', data => {
      reject(data.toString());
    });

    exec.exec(
      namespace,
      podName,
      containerName,
      command,
      stdout,
      stderr,
      null,
      false,
      (status: any) => {
        if (status && status.status !== 'Success') {
          reject(`Command failed with status: ${status.status}`);
        } else {
          resolve(result);
        }
      }
    );
  });
};

const getPodNameByIp = async (namespace: string, ip: string): Promise<string | undefined> => {
  const kc = new KubeConfig();
  kc.loadFromDefault();
  const k8sApi = kc.makeApiClient(CoreV1Api);
  const pods = await k8sApi.listNamespacedPod(namespace);
  const pod = pods.body.items.find(pod => pod.status?.podIP === ip);
  return pod?.metadata?.name;
};

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
    const podName = await getPodNameByIp(namespace, instance.instanceId); // Map IP address to pod name
    if (podName) {
      try {
        const command = ['fs_cli', '-x', 'show channels count'];
        const result = await execCommand(namespace, podName, 'freeswitch', command);

        const channelsCountResult: string = result.split(' ')[0] as string;
        logger.info(
          `sync-calls-with-fs: got ${channelsCountResult} fs-cli result for ${instance.instanceId}`
        );
        const calls = parseInt(channelsCountResult, 10);

        if (!isNaN(calls)) {
          logger.debug(`sync-calls-with-fs: updating calls for instance ${instance.instanceId}`);
          await InstanceCallsService.setInstanceCalls(instance.instanceId, calls);
        } else {
          throw new Error('Invalid call count received from FreeSWITCH');
        }
      } catch (error) {
        logger.debug(
          `sync-calls-with-fs: got error code ${error?.code} for ${instance.instanceId}`
        );
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
    } else {
      logger.error(`sync-calls-with-fs: could not find pod for IP ${instance.instanceId}`);
    }
  }
  process.exit(0);
})();
