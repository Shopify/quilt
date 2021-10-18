import {MessageEndpoint} from '@remote-ui/rpc';

import {IFRAME_RUN_IDENTIFIER} from './constants';

export function createIframeWorkerMessenger(
  url: URL,
  prepareIframe: (iframe: HTMLIFrameElement) => void,
): MessageEndpoint {
  const {port1, port2} = new MessageChannel();

  const iframe = document.createElement('iframe');
  iframe.setAttribute('style', 'display:none;');

  function loadHandler() {
    port1.start();
    iframe.contentWindow!.postMessage(
      {[IFRAME_RUN_IDENTIFIER]: url.href},
      '*',
      [port2],
    );

    iframe.removeEventListener('load', loadHandler);
  }

  iframe.addEventListener('load', loadHandler);

  prepareIframe(iframe);
  document.body.appendChild(iframe);

  return {
    postMessage: (...args: [any, Transferable[]]) => port1.postMessage(...args),
    addEventListener: (...args) => port1.addEventListener(...args),
    removeEventListener: (...args) => port1.removeEventListener(...args),
    terminate() {
      port1.close();
      iframe.remove();
    },
  };
}
