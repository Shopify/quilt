import React from 'react';
import {useIntersection} from '@shopify/react-intersection-observer';
import {DeferTiming, RequestIdleCallbackHandle} from '@shopify/async';
import {useMountedRef} from '@shopify/react-hooks';

import load from './load';

interface Options<Imported> {
  nonce?: string;
  defer?: DeferTiming;
  getImport(window: Window): Imported;
}

export enum Status {
  Initial = 'Initial',
  Failed = 'Failed',
  Complete = 'Complete',
  Loading = 'Loading',
}

type Result<Imported = unknown> =
  | {status: Status.Initial}
  | {status: Status.Loading}
  | {status: Status.Failed; error: Error}
  | {status: Status.Complete; imported: Imported};

export function useImportRemote<Imported = unknown>(
  source: string,
  options: Options<Imported>,
): {
  result: Result<Imported>;
  intersectionRef: React.Ref<HTMLElement | null>;
} {
  const {defer = DeferTiming.Mount, nonce = '', getImport} = options;
  const [result, setResult] = React.useState<Result<Imported>>({
    status: Status.Initial,
  });
  const idleCallbackHandle = React.useRef<RequestIdleCallbackHandle | null>(
    null,
  );
  const mounted = useMountedRef();

  const deferOption = React.useRef(defer);

  if (deferOption.current !== defer) {
    throw new Error(
      [
        'You’ve changed the defer strategy on an <ImportRemote />',
        'component after it has mounted. This is not supported.',
      ].join(' '),
    );
  }

  let intersection: IntersectionObserverEntry | null = null;
  let intersectionRef: React.Ref<HTMLElement | null> = null;

  // Normally this would be dangerous but because we are
  // guaranteed to have thrown if the defer option changes
  // we can be confident that a given use of this hook
  // will only ever hit one of these two cases.
  /* eslint-disable react-hooks/rules-of-hooks */
  if (defer === DeferTiming.InViewport) {
    [intersection, intersectionRef] = useIntersection();
  }
  /* eslint-enable react-hooks/rules-of-hooks */

  const loadRemote = React.useCallback(async () => {
    try {
      setResult({status: Status.Loading});
      const importResult = await load(source, getImport, nonce);

      if (mounted.current) {
        setResult({status: Status.Complete, imported: importResult});
      }
    } catch (error) {
      if (mounted.current) {
        setResult({status: Status.Failed, error});
      }
    }
  }, [getImport, mounted, nonce, source]);

  React.useEffect(() => {
    if (
      result.status === Status.Initial &&
      defer === DeferTiming.InViewport &&
      intersection &&
      intersection.isIntersecting
    ) {
      loadRemote();
    }
  }, [result, defer, intersection, loadRemote]);

  React.useEffect(() => {
    if (defer === DeferTiming.Idle) {
      if ('requestIdleCallback' in window) {
        idleCallbackHandle.current = window.requestIdleCallback(loadRemote);
      } else {
        loadRemote();
      }
    } else if (defer === DeferTiming.Mount) {
      loadRemote();
    }

    return () => {
      if (
        idleCallbackHandle.current != null &&
        typeof (window as any).cancelIdleCallback === 'function'
      ) {
        (window as any).cancelIdleCallback(idleCallbackHandle.current);
        idleCallbackHandle.current = null;
      }
    };
  }, [defer, loadRemote, intersection, nonce, getImport, source]);

  return {result, intersectionRef};
}
