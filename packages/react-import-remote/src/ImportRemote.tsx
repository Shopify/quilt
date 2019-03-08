import * as React from 'react';
import {Preconnect} from '@shopify/react-html';
import {
  RequestIdleCallbackHandle,
  WindowWithRequestIdleCallback,
  DeferTiming,
} from '@shopify/async';
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

export default class ImportRemote extends React.PureComponent<Props, never> {
  private idleCallbackHandle?: RequestIdleCallbackHandle;

  componentWillUnmount() {
    if (this.idleCallbackHandle != null && 'cancelIdleCallback' in window) {
      (window as WindowWithRequestIdleCallback).cancelIdleCallback(
        this.idleCallbackHandle,
      );
    }
  }

  async componentDidMount() {
    if (
      this.props.defer === DeferTiming.Idle &&
      'requestIdleCallback' in window
    ) {
      this.idleCallbackHandle = (window as WindowWithRequestIdleCallback).requestIdleCallback(
        this.loadRemote,
      );
    } else {
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
    const {source, preconnect} = this.props;

    if (preconnect) {
      const url = new URL(source);
      return <Preconnect source={url.origin} />;
    }

    return null;
  }

  async loadRemote() {
    const {source, nonce = '', getImport, onError, onImported} = this.props;

    try {
      const imported = await load(source, getImport, nonce);
      onImported(imported);
    } catch (error) {
      onError(error);
    }
  }
}
