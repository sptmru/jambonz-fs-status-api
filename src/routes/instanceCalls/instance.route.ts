import { FastifyInstance } from 'fastify';
import {
  deleteInstanceData,
  deleteAllInstances,
  getAllInstances,
  getAvailableInstances,
  getInstanceCalls,
  setInstanceCalls,
  updateInstanceCalls,
  getTotalCallsOnCluster,
} from './instance.route-options';
import { InstanceCallsController } from '../../controllers/instance/InstanceCallsController';

export class InstanceRoute {
  public prefix: string = '/instanceCalls';

  // eslint-disable-next-line require-await
  async routes(fastify: FastifyInstance): Promise<void> {
    fastify.get('', getAllInstances, InstanceCallsController.getAllInstances);
    fastify.get('/available', getAvailableInstances, InstanceCallsController.getAvailableInstances);
    fastify.get('/:instanceId', getInstanceCalls, InstanceCallsController.getInstanceCalls);
    fastify.get('/totalcalls',
      getTotalCallsOnCluster,
      InstanceCallsController.getTotalCallsOnCluster
    );
    fastify.post('', setInstanceCalls, InstanceCallsController.setInstanceCalls);
    fastify.put('/:instanceId', updateInstanceCalls, InstanceCallsController.updateInstanceCalls);
    fastify.delete('', deleteAllInstances, InstanceCallsController.deleteAllInstances);
    fastify.delete('/:instanceId', deleteInstanceData, InstanceCallsController.deleteInstanceData);
  }
}
