import { FastifyReply, FastifyRequest } from 'fastify';
import { InstanceCallsService } from '../../services/instance/InstanceCallsService';
import { InstanceParams } from '../../domain/types/instance/InstanceParams.type';
import { InstanceCallsData } from '../../domain/types/instance-calls/InstanceCallsData.type';
import { UpdateInstanceCallsData } from '../../domain/types/instance-calls/UpdateInstanceCallsData.type';
import { CallsQuantityModificationTypes } from '../../domain/types/instance-calls/CallsQuantityModificationTypes.enum';

export class InstanceCallsController {
  static async getInstanceCalls(
    request: FastifyRequest<{ Params: InstanceParams }>,
    reply: FastifyReply
  ): Promise<FastifyReply> {
    const { instanceId } = request.params;
    const callsQuantity = await InstanceCallsService.getInstanceCalls(instanceId);
    return reply.code(200).send({ instanceId: instanceId, callsQuantity: callsQuantity });
  }

  static async getAllInstances(
    _request: FastifyRequest,
    reply: FastifyReply
  ): Promise<FastifyReply> {
    const instanceData = await InstanceCallsService.getAllInstancesSortedByCalls();
    return reply.code(200).send(instanceData);
  }

  static async setInstanceCalls(
    request: FastifyRequest<{ Body: InstanceCallsData }>,
    reply: FastifyReply
  ): Promise<FastifyReply> {
    const { instanceId, callsQuantity } = request.body;
    await InstanceCallsService.setInstanceCalls(instanceId, callsQuantity);
    return reply.code(201).send({ instanceId: instanceId, callsQuantity: callsQuantity });
  }

  static async updateInstanceCalls(
    request: FastifyRequest<{ Params: InstanceParams; Body: UpdateInstanceCallsData }>,
    reply: FastifyReply
  ): Promise<FastifyReply> {
    const { instanceId } = request.params;
    const { modificationType } = request.body;
    switch (modificationType) {
      case CallsQuantityModificationTypes.INCREMENT:
        await InstanceCallsService.incrementInstanceCalls(instanceId);
        return reply.code(200).send({ message: 'Calls quantity incremented' });
      case CallsQuantityModificationTypes.DECREMENT:
        await InstanceCallsService.decrementInstanceCalls(instanceId);
        return reply.code(200).send({ message: 'Calls quantity decremented' });
      default:
        return reply
          .code(400)
          .send({ error: 'Invalid modification type, should be INCREMENT OR DECREMENT' });
    }
  }

  static async decrementInstanceCalls(
    request: FastifyRequest<{ Params: InstanceParams }>,
    reply: FastifyReply
  ): Promise<FastifyReply> {
    const { instanceId } = request.params;
    await InstanceCallsService.decrementInstanceCalls(instanceId);
    return reply.code(200).send({ message: 'Calls quantity decremented' });
  }

  static async deleteInstanceData(
    request: FastifyRequest<{ Params: InstanceParams }>,
    reply: FastifyReply
  ): Promise<FastifyReply> {
    const { instanceId } = request.params;
    await InstanceCallsService.deleteInstanceData(instanceId);
    return reply.code(204).send();
  }

  static async deleteAllInstances(
    _request: FastifyRequest,
    reply: FastifyReply
  ): Promise<FastifyReply> {
    await InstanceCallsService.deleteAllInstancesData();
    return reply.code(204).send();
  }
}
