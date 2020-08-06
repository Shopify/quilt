export {createEndpoint} from './endpoint';
export type {Endpoint} from './endpoint';
export {
  createChannelFunctionStrategy,
  createMessengerFunctionStrategy,
} from './strategies';
export {fromMessagePort, fromWebWorker} from './adaptors';
export {
  retain,
  release,
  StackFrame,
  RELEASE_METHOD,
  RETAIN_METHOD,
  RETAINED_BY,
} from './memory';
export type {MemoryManageable, Retainer} from './memory';
export type {
  FunctionStrategy,
  FunctionStrategyOptions,
  RemoteCallable,
  SafeRpcArgument,
  MessageEndpoint,
} from './types';
