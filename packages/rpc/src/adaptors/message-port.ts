import {MessageEndpoint} from '../types';

export function fromMessagePort(messagePort: MessagePort): MessageEndpoint {
  return {
    postMessage: (...args) => messagePort.postMessage(...args),
    addEventListener: (...args) => messagePort.addEventListener(...args),
    removeEventListener: (...args) => messagePort.removeEventListener(...args),
    terminate() {
      messagePort.close();
    },
  };
}
