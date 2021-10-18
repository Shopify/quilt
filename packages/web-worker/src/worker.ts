import {createEndpoint, fromWebWorker} from '@remote-ui/rpc';

const endpoint = createEndpoint(fromWebWorker(self as any), {
  callable: [],
});

self.addEventListener('message', ({data}: MessageEvent) => {
  if (data == null) {
    return;
  }

  if (data.__replace instanceof MessagePort) {
    endpoint.replace(data.__replace);
    data.__replace.start();
  }
});

Object.defineProperty(self, 'endpoint', {
  value: endpoint,
  enumerable: false,
  writable: false,
  configurable: true,
});

export {endpoint};
