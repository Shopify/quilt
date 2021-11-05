import {createIframeWorkerMessenger} from './create-messenger';

export function createRemoteOriginIframeMessengerFactory(iframeSrc: string) {
  return (url: URL) => {
    return createIframeWorkerMessenger(url, (iframe) => {
      iframe.src = iframeSrc;
    });
  };
}
