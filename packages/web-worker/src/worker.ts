import * as Comlink from 'comlink';

export function expose(api: any) {
  Comlink.expose(api);
}
