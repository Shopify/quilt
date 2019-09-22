const cache = new Map<string, Promise<any>>();

export default function load<
  Imported = any,
  CustomWindow extends Window = Window
>(
  source: string,
  getImport: (window: CustomWindow) => Imported,
  nonce: string,
): Promise<Imported> {
  if (typeof window === 'undefined') {
    return Promise.reject(
      new Error('You can’t import a remote module from the server'),
    );
  }

  const cachedModule = cache.get(source);

  if (cachedModule != null) {
    return cachedModule;
  }

  const scriptTag = scriptTagFor(source, nonce);
  appendScriptTag(scriptTag);

  const promise = new Promise<Imported>((resolve, reject) => {
    function scriptTagOnLoad() {
      scriptTag.removeEventListener('load', scriptTagOnLoad);
      scriptTag.removeEventListener('error', scriptTagOnError);
      resolve(getImport(window as CustomWindow));
    }

    function scriptTagOnError() {
      scriptTag.removeEventListener('load', scriptTagOnLoad);
      scriptTag.removeEventListener('error', scriptTagOnError);
      reject(new Error('Script tag failed to load remote source'));
    }

    scriptTag.addEventListener('load', scriptTagOnLoad);
    scriptTag.addEventListener('error', scriptTagOnError);
  });

  cache.set(source, promise);
  return promise;
}

export function clearCache() {
  cache.clear();
}

function scriptTagFor(source: string, nonce: string) {
  const node = document.createElement('script');
  node.setAttribute('type', 'text/javascript');
  node.setAttribute('src', source);

  if (nonce.length > 0) {
    node.setAttribute('nonce', nonce);
  }

  return node;
}

function appendScriptTag(scriptTag: HTMLScriptElement) {
  document.head.appendChild(scriptTag);
}
