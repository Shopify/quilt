import {useEffect, useContext} from 'react';
import {useServerEffect} from '@shopify/react-effect';

import {HtmlContext} from './context';
import {HtmlManager} from './manager';

export function useDomEffect(
  perform: (manager: HtmlManager) => (() => void),
  inputs: unknown[] = [],
) {
  const manager = useContext(HtmlContext);
  const effect = () => {
    perform(manager);
  };

  useServerEffect(effect, manager.effect);
  useEffect(effect, [manager, ...inputs]);
}

export function useTitle(title: string) {
  useDomEffect(manager => manager.addTitle(title), [title]);
}

export function useLink(link: React.HTMLProps<HTMLLinkElement>) {
  useDomEffect(manager => manager.addLink(link), [JSON.stringify(link)]);
}

export function useMeta(meta: React.HTMLProps<HTMLMetaElement>) {
  useDomEffect(manager => manager.addMeta(meta), [JSON.stringify(meta)]);
}

export function usePreconnect(source: string) {
  useDomEffect(manager =>
    manager.addLink({
      rel: 'dns-prefetch preconnect',
      href: source,
    }),
  );
}

export function useFavicon(source: string) {
  useDomEffect(manager =>
    manager.addLink({
      rel: 'shortcut icon',
      type: 'image/x-icon',
      href: source,
    }),
  );
}

export function useClientDomEffect(
  perform: (manager: HtmlManager) => (() => void),
  inputs: unknown[] = [],
) {
  const manager = useContext(HtmlContext);

  useEffect(
    () => {
      perform(manager);
    },
    [manager, ...inputs],
  );
}

export function useServerDomEffect(
  perform: (manager: HtmlManager) => (() => void),
) {
  const manager = useContext(HtmlContext);

  useServerEffect(() => {
    perform(manager);
  }, manager.effect);
}
