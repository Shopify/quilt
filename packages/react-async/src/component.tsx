import * as React from 'react';
import {LoadProps} from '@shopify/async';
import {Props as ComponentProps} from '@shopify/useful-types';

import {Async} from './Async';

interface Options<
  Props,
  PreloadProps = {},
  PrefetchProps = {},
  KeepFreshProps = {}
> extends LoadProps<React.ComponentType<Props>> {
  renderLoading?(): React.ReactNode;
  renderPreload?(props?: PreloadProps): React.ReactNode;
  renderPrefetch?(props?: PrefetchProps): React.ReactNode;
  renderKeepFresh?(props?: KeepFreshProps): React.ReactNode;
}

export interface AsyncComponentType<
  Props,
  PreloadProps,
  PrefetchProps,
  KeepFreshProps
> {
  (props: Props): React.ReactElement<ComponentProps<typeof Async>>;
  Preload(props: PreloadProps): React.ReactElement<{}>;
  Prefetch(props: PrefetchProps): React.ReactElement<{}>;
  KeepFresh(props: KeepFreshProps): React.ReactElement<{}>;
}

export function createAsyncComponent<
  Props,
  PreloadProps = {},
  PrefetchProps = {},
  KeepFreshProps = {}
>({
  load,
  id,
  renderLoading,
  renderPreload = noopRender,
  renderPrefetch = noopRender,
  renderKeepFresh = noopRender,
}: Options<
  Props,
  PreloadProps,
  PrefetchProps,
  KeepFreshProps
>): AsyncComponentType<Props, PreloadProps, PrefetchProps, KeepFreshProps> {
  function AsyncComponent(props: Props) {
    return (
      <Async
        load={load}
        id={id}
        renderLoading={renderLoading}
        render={Component => (Component ? <Component {...props} /> : null)}
      />
    );
  }

  function Preload(props: PreloadProps) {
    return (
      <>
        {renderPreload(props)}
        <Async defer load={load} />
      </>
    );
  }

  function Prefetch(props: PrefetchProps) {
    return (
      <>
        {renderPrefetch(props)}
        <Async defer load={load} />
      </>
    );
  }

  function KeepFresh(props: KeepFreshProps) {
    return (
      <>
        {renderKeepFresh(props)}
        <Async defer load={load} />
      </>
    );
  }

  // Once we upgrade past TS 3.1, this will no longer be necessary,
  // because you can statically assign values to functions and TS
  // will know to augment its type
  const FinalComponent: AsyncComponentType<
    Props,
    PreloadProps,
    PrefetchProps,
    KeepFreshProps
  > = AsyncComponent as any;

  FinalComponent.Preload = Preload;
  FinalComponent.Prefetch = Prefetch;
  FinalComponent.KeepFresh = KeepFresh;

  return FinalComponent;
}

function noopRender() {
  return null;
}
