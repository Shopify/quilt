import * as React from 'react';
import {LoadProps, DeferTiming} from '@shopify/async';
import {Props as ComponentProps} from '@shopify/useful-types';

import {Async, AsyncPropsRuntime} from './Async';

interface ConstantProps {
  async?: AsyncPropsRuntime;
}

interface Options<
  Props,
  PreloadProps = {},
  PrefetchProps = {},
  KeepFreshProps = {}
> extends LoadProps<React.ComponentType<Props>> {
  defer?: DeferTiming;
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
  (props: Props & ConstantProps): React.ReactElement<
    ComponentProps<typeof Async>
  >;
  Preload(props: PreloadProps & ConstantProps): React.ReactElement<{}>;
  Prefetch(props: PrefetchProps & ConstantProps): React.ReactElement<{}>;
  KeepFresh(props: KeepFreshProps & ConstantProps): React.ReactElement<{}>;
}

export function createAsyncComponent<
  Props,
  PreloadProps = {},
  PrefetchProps = {},
  KeepFreshProps = {}
>({
  id,
  load,
  defer,
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
  function AsyncComponent(props: Props & ConstantProps) {
    // Can't create a spread from union type, so opt for a function that
    // does the dirty casting for us.
    const [componentProps, asyncProps] = splitProps(props);

    return (
      <Async
        load={load}
        id={id}
        defer={defer}
        renderLoading={renderLoading}
        render={Component =>
          Component ? <Component {...componentProps} /> : null
        }
        {...asyncProps}
      />
    );
  }

  function Preload(props: PreloadProps & ConstantProps) {
    const [componentProps, asyncProps] = splitProps(props);

    return (
      <>
        {renderPreload(componentProps)}
        <Async defer={DeferTiming.Idle} load={load} {...asyncProps} />
      </>
    );
  }

  function Prefetch(props: PrefetchProps & ConstantProps) {
    const [componentProps, asyncProps] = splitProps(props);

    return (
      <>
        {renderPrefetch(componentProps)}
        <Async defer={DeferTiming.Mount} load={load} {...asyncProps} />
      </>
    );
  }

  function KeepFresh(props: KeepFreshProps & ConstantProps) {
    const [componentProps, asyncProps] = splitProps(props);

    return (
      <>
        {renderKeepFresh(componentProps)}
        <Async defer={DeferTiming.Idle} load={load} {...asyncProps} />
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

function splitProps<Props>(
  props: Props & ConstantProps,
): [Props, AsyncPropsRuntime] {
  const {async, ...rest} = props as any;
  return [rest, async];
}
