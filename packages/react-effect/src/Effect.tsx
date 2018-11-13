import * as React from 'react';
import {METHOD_NAME, Extractable} from './extractable';

interface Props {
  kind?: symbol;
  serverOnly?: boolean;
  clientOnly?: boolean;
  perform(): void;
}

export default class Effect extends React.PureComponent<Props>
  implements Extractable {
  componentDidMount() {
    const {serverOnly} = this.props;
    return this.perform(!serverOnly);
  }

  [METHOD_NAME](include: boolean | symbol[]) {
    const {clientOnly} = this.props;
    return this.perform(clientOnly ? false : include);
  }

  render() {
    return this.props.children || null;
  }

  private perform(include: boolean | symbol[]) {
    const {kind, perform} = this.props;

    if (!include) {
      return undefined;
    }

    if (include === true || (kind != null && include.includes(kind))) {
      return perform();
    }

    return undefined;
  }
}
