import {useEffect, useContext} from 'react';
import {useServerEffect} from '@shopify/react-effect';
import {FirstArgument} from '@shopify/useful-types';

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
  useDomEffect(
    manager =>
      manager.addLink({
        rel: 'preconnect',
        href: source,
      }),
    [source],
  );
}

export function useFavicon(source: string) {
  useDomEffect(
    manager =>
      manager.addLink({
        rel: 'shortcut icon',
        type: 'image/x-icon',
        href: source,
      }),
    [source],
  );
}

export function useHtmlAttributes(
  htmlAttributes: FirstArgument<HtmlManager['addHtmlAttributes']>,
) {
  useDomEffect(manager => manager.addHtmlAttributes(htmlAttributes), [
    JSON.stringify(htmlAttributes),
  ]);
}

export function useBodyAttributes(
  bodyAttributes: FirstArgument<HtmlManager['addBodyAttributes']>,
) {
  useDomEffect(manager => manager.addBodyAttributes(bodyAttributes), [
    JSON.stringify(bodyAttributes),
  ]);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [manager, perform, ...inputs],
  );
}

export function useServerDomEffect(
  perform: (manager: HtmlManager) => (() => void),
) {
  const manager = useContext(HtmlContext);

  useServerEffect(() => perform(manager), manager.effect);
}
