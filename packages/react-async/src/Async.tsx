import * as React from 'react';
import {
  LoadProps,
  DeferTiming,
  RequestIdleCallbackHandle,
  WindowWithRequestIdleCallback,
} from '@shopify/async';
import {Omit} from '@shopify/useful-types';
import {Effect} from '@shopify/react-effect';
import {
  IntersectionObserver,
  UnsupportedBehavior,
} from '@shopify/react-intersection-observer';

import {AsyncAssetContext, AsyncAssetManager} from './context/assets';
import {trySynchronousResolve, resolve} from './utilities';

export interface AsyncPropsRuntime {
  defer?: DeferTiming;
  renderLoading?(): React.ReactNode;
}

interface Props<Value> extends LoadProps<Value>, AsyncPropsRuntime {
  manager?: AsyncAssetManager;
  render?(value: Value | null): React.ReactNode;
  renderLoading?(): React.ReactNode;
}

interface State<Value> {
  resolved: Value | null;
  loading: boolean;
}

class ConnectedAsync<Value> extends React.Component<
  Props<Value>,
  State<Value>
> {
  state: State<Value> = initialState(this.props);

  private mounted = true;
  private idleCallbackHandle?: RequestIdleCallbackHandle;

  componentWillUnmount() {
    this.mounted = false;

    if (this.idleCallbackHandle != null && 'cancelIdleCallback' in window) {
      (window as WindowWithRequestIdleCallback).cancelIdleCallback(
        this.idleCallbackHandle,
      );
    }
  }

  componentDidMount() {
    if (this.state.resolved != null) {
      return;
    }

    const {defer = DeferTiming.Mount} = this.props;

    if (this.props.defer === DeferTiming.Idle) {
      if ('requestIdleCallback' in window) {
        this.idleCallbackHandle = (window as WindowWithRequestIdleCallback).requestIdleCallback(
          this.load,
        );
      } else {
        this.load();
      }
    } else if (defer === DeferTiming.Mount) {
      this.load();
    }
  }

  render() {
    const {
      id,
      defer,
      manager,
      render = defaultRender,
      renderLoading = defaultRender,
    } = this.props;
    const {resolved, loading} = this.state;

    const effect =
      resolved != null && id != null && manager != null ? (
        <Effect
          kind={manager.effect}
          perform={() => manager.markAsUsed(id())}
        />
      ) : null;

    const content = loading ? renderLoading() : render(resolved);

    const intersectionObserver =
      loading && defer === DeferTiming.InViewport ? (
        <IntersectionObserver
          threshold={0}
          unsupportedBehavior={UnsupportedBehavior.TreatAsIntersecting}
          onIntersectionChange={this.loadIfIntersecting}
        />
      ) : null;

    return (
      <>
        {effect}
        {content}
        {intersectionObserver}
      </>
    );
  }

  private loadIfIntersecting = ({isIntersecting = true}) => {
    return isIntersecting ? this.load() : Promise.resolve();
  };

  private load = async () => {
    const resolved = await resolve(this.props.load);
    if (this.mounted) {
      this.setState({resolved, loading: false});
    }
  };
}

export function Async<Value>(props: Omit<Props<Value>, 'manager'>) {
  return (
    <AsyncAssetContext.Consumer>
      {manager => <ConnectedAsync manager={manager} {...props} />}
    </AsyncAssetContext.Consumer>
  );
}

function initialState<Value>(props: Props<Value>): State<Value> {
  const resolved = trySynchronousResolve<Value>({
    id: props.id,
    defer: props.defer,
  });

  return {
    resolved,
    loading: resolved == null,
  };
}

function defaultRender() {
  return null;
}
