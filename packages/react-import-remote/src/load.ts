const cache = new Map<string, Promise<any>>();

export default function load<
  Imported = any,
  CustomWindow extends Window = Window
>(
  source: string,
  getImport: (window: CustomWindow) => Imported,
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

  const scriptTag = scriptTagFor(source);
  appendScriptTag(scriptTag);

  const promise = new Promise<Imported>((resolve, reject) => {
    function scriptTagOnLoad() {
      scriptTag.removeEventListener('load', scriptTagOnLoad);
      scriptTag.removeEventListener('error', scriptTagOnError);
      resolve(getImport(window as CustomWindow));
    }

    function scriptTagOnError(error: any) {
      scriptTag.removeEventListener('load', scriptTagOnLoad);
      scriptTag.removeEventListener('error', scriptTagOnError);
      reject(error);
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

function scriptTagFor(source: string) {
  const node = document.createElement('script');
  node.setAttribute('type', 'text/javascript');
  node.setAttribute('src', source);
  return node;
}

function appendScriptTag(scriptTag: HTMLScriptElement) {
  document.head.appendChild(scriptTag);
}
