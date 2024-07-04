export const InstanceCallsDataDefinition = {
  $id: 'InstanceCallsData',
  type: 'object',
  required: ['instanceId', 'callsQuantity'],
  properties: {
    instanceId: {
      type: 'string',
    },
    callsQuantity: {
      type: 'number',
    },
  },
};
