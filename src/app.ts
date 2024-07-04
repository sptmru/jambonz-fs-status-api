import { Api } from './infrastructure/api/server';
import { HealthRoute } from './routes/health/health.route';
import { InstanceRoute } from './routes/instanceCalls/instance.route';
import { InstanceCallsDataDefinition } from './domain/definitions/InstanceCallsData.definition';
import { UpdateInstanceCallsDataDefinition } from './domain/definitions/UpdateInstanceCallsData.definition';
import { RedisClient } from './infrastructure/redis/client';

const api = new Api({
  plugins: [],
  routes: [HealthRoute, InstanceRoute],
  definitions: [InstanceCallsDataDefinition, UpdateInstanceCallsDataDefinition],
});
api.listen();

RedisClient.getInstance();
