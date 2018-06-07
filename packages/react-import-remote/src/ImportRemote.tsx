import * as React from 'react';
import Preconnect from '@shopify/react-preconnect';
import load from './load';

export interface Props<Imported = any> {
  source: string;
  preload?: boolean;
  onError(error: Error): void;
  getImport(window: Window): Imported;
  onImported(imported: Imported): void;
}

export default class ImportRemote extends React.PureComponent<Props, never> {
  async componentDidMount() {
    const {source, getImport, onError, onImported} = this.props;

    try {
      const imported = await load(source, getImport);
      onImported(imported);
    } catch (error) {
      onError(error);
    }
  }

  render() {
    const {source, preload} = this.props;

    if (preload) {
      const url = new URL(source);
      return <Preconnect hosts={[url.hostname]} />;
    }

    return null;
  }
}
