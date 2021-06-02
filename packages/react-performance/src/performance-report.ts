import {useRef, useCallback} from 'react';
import {Navigation, LifecycleEvent} from '@shopify/performance';
import {Header, Method} from '@shopify/network';

import {useNavigationListener} from './navigation-listener';
import {useLifecycleEventListener} from './lifecycle-event-listener';

export interface ErrorHandler {
  (error: any): void;
}

export function usePerformanceReport(
  url: string,
  {
    locale = undefined,
    onError = noop,
  }: {locale?: string; onError?: ErrorHandler} = {},
) {
  const navigations = useRef<Navigation[]>([]);
  const events = useRef<LifecycleEvent[]>([]);
  const timeout = useRef<ReturnType<typeof setTimeout>>();

  const sendReport = useCallback(() => {
    if (timeout.current != null) {
      return;
    }

    timeout.current = setTimeout(async () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
        timeout.current = undefined;
      }

      try {
        await fetch(url, {
          method: Method.Post,
          headers: {
            [Header.ContentType]: 'application/json',
          },
          body: JSON.stringify({
            connection: serializableClone((navigator as any).connection),
            events: events.current,
            navigations: navigations.current.map((navigation) => ({
              details: navigation.toJSON({removeEventMetadata: false}),
              metadata: navigation.metadata,
            })),
            pathname: window.location.pathname,
            locale,
          }),
        });
      } catch (error) {
        if (onError) {
          onError(error);
        }
      } finally {
        events.current = [];
        navigations.current = [];
      }
    }, 1000);
  }, [locale, onError, url]);

  const onNavigation = useCallback(
    (navigation: Navigation) => {
      navigations.current.push(navigation);
      sendReport();
    },
    [sendReport],
  );

  const onLifeCycleEvent = useCallback(
    (event: LifecycleEvent) => {
      events.current.push(event);
      sendReport();
    },
    [sendReport],
  );

  useNavigationListener(onNavigation);
  useLifecycleEventListener(onLifeCycleEvent);
}

function serializableClone<T>(object: T) {
  const output: T = {} as any;
  // We explicitly want to copy the inherited properties
  // eslint-disable-next-line guard-for-in
  for (const key in object) {
    output[key] = object[key];
  }
  return output;
}

function noop() {}
