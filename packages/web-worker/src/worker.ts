import {createEndpoint} from './endpoint';

export function expose(api: any) {
  const endpoint = createEndpoint((self as any) as Worker);
  (global as any).endpoint = endpoint;
  endpoint.expose(api);
}
