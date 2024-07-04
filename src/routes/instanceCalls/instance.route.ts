import { FastifyInstance } from 'fastify';
import { deleteInstanceData, getInstanceCalls, setInstanceCalls, updateInstanceCalls } from './instance.route-options';
import { InstanceCallsController } from '../../controllers/instance/InstanceCallsController';

export class InstanceRoute {
  public prefix: string = '/instanceCalls';

  // eslint-disable-next-line require-await
  async routes(fastify: FastifyInstance): Promise<void> {
    fastify.get('/:instanceId', getInstanceCalls, InstanceCallsController.getInstanceCalls);
    fastify.post('', setInstanceCalls, InstanceCallsController.setInstanceCalls);
    fastify.put('/:instanceId', updateInstanceCalls, InstanceCallsController.updateInstanceCalls);
    fastify.delete('/:instanceId', deleteInstanceData, InstanceCallsController.deleteInstanceData);
  }
}
