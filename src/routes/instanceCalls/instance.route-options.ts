import { RouteOptionsWithoutHandler } from '../../infrastructure/api/types/RouteOptionsWithoutHandler';
import { OpenAPIV3 } from 'openapi-types';
import HttpMethods = OpenAPIV3.HttpMethods;

const baseUrl = '/api/v1/instanceCalls';

export const getInstanceCalls: RouteOptionsWithoutHandler = {
  method: HttpMethods.GET,
  url: `${baseUrl}/:instanceId`,
  schema: {
    description: 'Get instance current calls quantity',
    summary: 'Get instance current calls quantity',
    tags: ['instance', 'instance-calls'],
    response: {
      200: {
        description: 'Current calls quantity',
        type: 'object',
        properties: {
          instanceId: { type: 'string' },
          callsQuantity: { type: 'number' },
        },
      },
      400: {
        description: 'Validation error',
        type: 'object',
        properties: {
          statusCode: { type: 'number' },
          code: { type: 'string' },
          error: { type: 'string' },
          message: { type: 'string' },
        },
      },
      500: {
        description: 'Internal server error',
        type: 'object',
        properties: {
          statusCode: { type: 'number' },
          error: { type: 'string' },
          message: { type: 'string' },
        },
      },
    },
  },
};

export const setInstanceCalls: RouteOptionsWithoutHandler = {
  method: HttpMethods.POST,
  url: baseUrl,
  schema: {
    description: 'Set instance current calls quantity',
    summary: 'Set instance current calls quantity',
    tags: ['instance', 'instance-calls'],
    body: { $ref: 'InstanceCallsData#' },
    response: {
      201: { $ref: 'InstanceCallsData#' },
      400: {
        description: 'Validation error',
        type: 'object',
        properties: {
          statusCode: { type: 'number' },
          code: { type: 'string' },
          error: { type: 'string' },
          message: { type: 'string' },
        },
      },
      500: {
        description: 'Internal server error',
        type: 'object',
        properties: {
          statusCode: { type: 'number' },
          error: { type: 'string' },
          message: { type: 'string' },
        },
      },
    },
  },
};

export const updateInstanceCalls: RouteOptionsWithoutHandler = {
  method: HttpMethods.PUT,
  url: `${baseUrl}/:instanceId`,
  schema: {
    description: 'Update instance current calls quantity',
    summary: 'Update instance current calls quantity',
    tags: ['instance', 'instance-calls'],
    body: { $ref: 'UpdateInstanceCallsDataDefinition#' },
    response: {
      200: {
        description: 'Instance calls quantity incremented',
        type: 'object',
        properties: {
          message: { type: 'string' },
        },
      },
      400: {
        description: 'Invalid modification type, should be INCREMENT or DECREMENT',
        type: 'object',
        properties: {
          error: { type: 'string' },
        },
      },
      500: {
        description: 'Internal server error',
        type: 'object',
        properties: {
          statusCode: { type: 'number' },
          error: { type: 'string' },
          message: { type: 'string' },
        },
      },
    },
  },
};

export const deleteInstanceData: RouteOptionsWithoutHandler = {
  method: HttpMethods.DELETE,
  url: `${baseUrl}/:instanceId`,
  schema: {
    description: 'Delete instance data',
    summary: 'Delete instance data',
    tags: ['instance', 'instance-calls'],
    response: {
      204: {
        description: false,
      },
      400: {
        description: 'Validation error',
        type: 'object',
        properties: {
          statusCode: { type: 'number' },
          code: { type: 'string' },
          error: { type: 'string' },
          message: { type: 'string' },
        },
      },
      500: {
        description: 'Internal server error',
        type: 'object',
        properties: {
          statusCode: { type: 'number' },
          error: { type: 'string' },
          message: { type: 'string' },
        },
      },
    },
  },
};
