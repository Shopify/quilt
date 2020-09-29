import {createEndpoint, fromWebWorker} from '@shopify/rpc';

export function expose(api: any) {
  const endpoint = createEndpoint(fromWebWorker(self as any));

  self.addEventListener('message', ({data}: MessageEvent) => {
    if (data == null) {
      return;
    }

    if (data.__replace instanceof MessagePort) {
      endpoint.replace(data.__replace);
      data.__replace.start();
    }
  });

  Reflect.defineProperty(self, 'endpoint', {
    value: endpoint,
  });

  endpoint.expose(api);
}
