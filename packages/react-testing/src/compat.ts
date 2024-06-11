import ReactDOM from 'react-dom';
import React from 'react';
import type {Root as ReactRoot} from 'react-dom/client';
import {act as oldAct} from 'react-dom/test-utils';

import type {ReactInstance, Fiber} from './types';

export function getInternals(instance: ReactInstance): Fiber {
  // In React 17+ _reactInternalFiber was renamed to _reactInternals. As such we need to handle both APIs to maintain support.

  if ('_reactInternalFiber' in instance) {
    return instance._reactInternalFiber;
  }

  return instance._reactInternals;
}

/** Shim to provide createRoot backwards compatibility for React < 18 */
function createRootShim(element: HTMLElement): ReactRoot {
  /* eslint-disable react/no-deprecated */
  return {
    render(children: React.ReactChild | Iterable<React.ReactNode>): void {
      ReactDOM.render(children as any, element as any);
    },
    unmount(): void {
      ReactDOM.unmountComponentAtNode(element as any);
    },
  };
  /* eslint-enable react/no-deprecated */
}

/** Uses React >= 18 createRoot if available or falls back to shim*/
export function createRoot(element: HTMLElement): ReactRoot {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require('react-dom/client').createRoot(element);
  } catch {
    return createRootShim(element);
  }
}

export const isLegacyReact = parseInt(React.version, 10) < 18;

export const act: typeof oldAct = (() => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const {act} = require('react');
    return act ?? oldAct;
  } catch {
    return oldAct;
  }
})();

// https://github.com/facebook/react/blob/12adaffef7105e2714f82651ea51936c563fe15c/packages/shared/enqueueTask.js#L13
let enqueueTaskImpl: any = null;

export function enqueueTask(task: (v: any) => void) {
  if (enqueueTaskImpl === null) {
    try {
      // read require off the module object to get around the bundlers.
      // we don't want them to detect a require and bundle a Node polyfill.
      const requireString = `require${Math.random()}`.slice(0, 7);
      const nodeRequire = module && module[requireString];
      // assuming we're in node, let's try to get node's
      // version of setImmediate, bypassing fake timers if any.
      enqueueTaskImpl = nodeRequire.call(module, 'timers').setImmediate;
    } catch (_err) {
      // we're in a browser
      // we can't use regular timers because they may still be faked
      // so we try MessageChannel+postMessage instead
      enqueueTaskImpl = function (callback: () => void) {
        const channel = new MessageChannel();
        channel.port1.onmessage = callback;
        channel.port2.postMessage(undefined);
      };
    }
  }
  return enqueueTaskImpl!(task);
}
