import * as React from 'react';
import {Preconnect} from '@shopify/react-html';
import {DeferTiming} from '@shopify/async';

import {useImportRemote, Status} from './hooks';

export interface Props<Imported = any> {
  source: string;
  nonce?: string;
  preconnect?: boolean;
  getImport(window: Window): Imported;
  onImported(imported: Imported | Error): void;
  defer?: DeferTiming;
}

export default function ImportRemote<T = unknown>({
  source,
  nonce,
  preconnect,
  getImport,
  onImported,
  defer,
}: Props<T>) {
  const {result, intersectionRef} = useImportRemote<T>(source, {
    defer,
    nonce,
    getImport,
  });

  const intersectionObserver =
    defer === DeferTiming.InViewport && intersectionRef ? (
      <div ref={intersectionRef as React.RefObject<HTMLDivElement>} />
    ) : null;

  React.useEffect(
    () => {
      switch (result.status) {
        case Status.Failed:
          onImported(result.error);
          return;
        case Status.Complete:
          onImported(result.imported);
      }
    },
    [result, onImported],
  );

  if (preconnect) {
    const url = new URL(source);
    return (
      <>
        <Preconnect source={url.origin} />
        {intersectionObserver}
      </>
    );
  }

  return intersectionObserver;
}
