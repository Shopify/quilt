import {createIframeWorkerMessenger} from './create-messenger';
import {IFRAME_RUN_IDENTIFIER} from './constants';

export function createNullOriginIframeMessenger(url: URL) {
  return createIframeWorkerMessenger(url, (iframe) => {
    const iframeSource = `
    <html>
      <body>
        <script>
          window.addEventListener('message', function (event) {
            var data = event.data;
            if (data == null || typeof data.${IFRAME_RUN_IDENTIFIER} !== 'string') return;

            var workerScript = URL.createObjectURL(
              new Blob(['importScripts(' + JSON.stringify(data.${IFRAME_RUN_IDENTIFIER}) + ');']),
            );

            var worker = new Worker(workerScript);
            worker.postMessage({__replace: event.ports[0]}, [event.ports[0]]);
          });
        </script>
      </body>
    </html>
  `;

    iframe.setAttribute('sandbox', 'allow-scripts');
    iframe.srcdoc = iframeSource;
  });
}
