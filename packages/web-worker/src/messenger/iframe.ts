import {MessageEndpoint} from '@shopify/rpc';

const RUN = '__run';
const IFRAME_SOURCE = `
  <html>
    <body>
      <script>
        window.addEventListener('message', function (event) {
          var data = event.data;
          if (data == null || typeof data.${RUN} !== 'string') return;

          var workerScript = URL.createObjectURL(
            new Blob(['importScripts(' + JSON.stringify(data.${RUN}) + ');']),
          );

          var worker = new Worker(workerScript);
          worker.postMessage({__replace: event.ports[0]}, [event.ports[0]]);
        });
      </script>
    </body>
  </html>
`;

export function createIframeWorkerMessenger(url: URL): MessageEndpoint {
  const {port1, port2} = new MessageChannel();

  const iframe = document.createElement('iframe');
  iframe.setAttribute('sandbox', 'allow-scripts');
  iframe.setAttribute('style', 'display:none;');
  iframe.addEventListener('load', () => {
    port1.start();
    iframe.contentWindow!.postMessage({[RUN]: url.href}, '*', [port2]);
  });
  iframe.srcdoc = IFRAME_SOURCE;
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
