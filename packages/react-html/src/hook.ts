import {useEffect, useContext} from 'react';
import {useServerEffect} from '@shopify/react-effect';

import {HtmlContext} from './context';
import Manager from './manager';

export function useDomEffect(
  perform: (manager: Manager) => (() => void),
  inputs: any[] = [],
) {
  const manager = useContext(HtmlContext);
  const effect = manager
    ? () => {
        perform(manager);
      }
    : noop;

  useServerEffect(effect, manager && manager.effect);
  useEffect(effect, [manager, ...inputs]);
}

function noop() {}
