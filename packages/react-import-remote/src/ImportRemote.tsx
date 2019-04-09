import * as React from 'react';
import {Preconnect} from '@shopify/react-html';
import {
  RequestIdleCallbackHandle,
  WindowWithRequestIdleCallback,
  DeferTiming,
} from '@shopify/async';
import {
  IntersectionObserver,
  UnsupportedBehavior,
} from '@shopify/react-intersection-observer';
import load from './load';

export interface Props<Imported = any> {
  source: string;
  nonce?: string;
  preconnect?: boolean;
  onError(error: Error): void;
  getImport(window: Window): Imported;
  onImported(imported: Imported): void;
  defer?: DeferTiming;
}

interface State {
  loaded: boolean;
  loading: boolean;
}

export default class ImportRemote extends React.PureComponent<Props, State> {
  state: State = {loaded: false, loading: false};
  private idleCallbackHandle?: RequestIdleCallbackHandle;

  componentWillUnmount() {
    if (this.idleCallbackHandle != null && 'cancelIdleCallback' in window) {
      (window as WindowWithRequestIdleCallback).cancelIdleCallback(
        this.idleCallbackHandle,
      );
    }
  }

  async componentDidMount() {
    const {defer = DeferTiming.Mount} = this.props;

    if (defer === DeferTiming.Idle) {
      if ('requestIdleCallback' in window) {
        this.idleCallbackHandle = (window as WindowWithRequestIdleCallback).requestIdleCallback(
          this.loadRemote,
        );
      } else {
        this.loadRemote();
      }
    } else if (defer === DeferTiming.Mount) {
      await this.loadRemote();
    }
  }

  async componentDidUpdate({source: oldSource}: Props) {
    const {source} = this.props;

    if (oldSource !== source) {
      await this.loadRemote();
    }
  }

  render() {
    const {loaded, loading} = this.state;
    const {source, preconnect, defer} = this.props;

    const intersectionObserver =
      !loaded && !loading && defer === DeferTiming.InViewport ? (
        <IntersectionObserver
          threshold={0}
          unsupportedBehavior={UnsupportedBehavior.TreatAsIntersecting}
          onIntersectionChange={this.loadRemoteIfIntersecting}
        />
      ) : null;

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

  private loadRemoteIfIntersecting = ({isIntersecting = true}) => {
    return isIntersecting ? this.loadRemote() : Promise.resolve();
  };

  private loadRemote = () => {
    return new Promise(resolve => {
      this.setState({loaded: false, loading: true}, async () => {
        const {source, nonce = '', getImport, onError, onImported} = this.props;

        try {
          const imported = await load(source, getImport, nonce);
          onImported(imported);
        } catch (error) {
          onError(error);
        } finally {
          this.setState({loaded: true, loading: false}, resolve);
        }
      });
    });
  };
}
