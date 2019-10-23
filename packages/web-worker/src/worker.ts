import {createEndpoint} from './endpoint';

export function expose(api: any) {
  const endpoint = createEndpoint(self as any);

  Reflect.defineProperty(self, 'endpoint', {
    value: endpoint,
  });

  endpoint.expose(api);
}
