import * as React from 'react';
import {Effect} from '@shopify/react-effect';
import {Context} from '../context';
import {EFFECT_ID} from '../utilities';
import Manager from '../manager';

type Props = React.HTMLProps<HTMLLinkElement>;

export default class Link extends React.PureComponent<Props> {
  private removeLink?: ReturnType<InstanceType<typeof Manager>['addLink']>;

  componentWillUnmount() {
    if (this.removeLink) {
      this.removeLink();
    }
  }

  render() {
    return (
      <Context.Consumer>
        {manager => (
          <Effect
            key={JSON.stringify(this.props)}
            kind={EFFECT_ID}
            perform={() => {
              if (this.removeLink) {
                this.removeLink();
              }

              this.removeLink = manager.addLink(this.props);
            }}
          />
        )}
      </Context.Consumer>
    );
  }
}
