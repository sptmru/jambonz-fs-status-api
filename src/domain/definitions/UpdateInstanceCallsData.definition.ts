import { CallsQuantityModificationTypes } from '../types/instance-calls/CallsQuantityModificationTypes.enum';

export const UpdateInstanceCallsDataDefinition = {
  $id: 'UpdateInstanceCallsDataDefinition',
  type: 'object',
  required: ['modificationType'],
  properties: {
    modificationType: {
      type: 'string',
      enum: Object.values(CallsQuantityModificationTypes),
    },
  },
};
