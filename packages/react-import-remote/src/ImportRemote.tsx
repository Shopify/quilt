import * as React from 'react';
import Preconnect from '@shopify/react-preconnect';
import load from './load';

export interface Props<Imported = any> {
  source: string;
  nonce?: string;
  preconnect?: boolean;
  onError(error: Error): void;
  getImport(window: Window): Imported;
  onImported(imported: Imported): void;
}

export default class ImportRemote extends React.PureComponent<Props, never> {
  async componentDidMount() {
    await this.loadRemote();
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
      return <Preconnect hosts={[url.hostname]} />;
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
