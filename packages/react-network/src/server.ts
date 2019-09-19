import {Context} from 'koa';
import {NetworkManager, EFFECT_ID, STATE_ID} from './manager';

export {NetworkContext} from './context';
export {NetworkManager, EFFECT_ID};

export function applyToContext<T extends Context>(
  ctx: T,
  manager: NetworkManager,
) {
  const {status, redirectUrl, headers, serverState} = manager.extract();

  if (redirectUrl) {
    ctx.redirect(redirectUrl);
  }

  if (status) {
    ctx.status = status;
  }

  for (const [header, value] of headers) {
    ctx.set(header, value);
  }

  ctx.state[STATE_ID] = serverState;

  return ctx;
}

export function getServerState<T extends Context>(ctx: T) {
  return ctx.state[STATE_ID];
}
