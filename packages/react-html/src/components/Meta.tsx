import * as React from 'react';
import {Effect} from '@shopify/react-effect';
import {Context} from '../context';
import {EFFECT_ID} from '../utilities';
import Manager from '../manager';

type Props = React.HTMLProps<HTMLMetaElement>;

export const EXTRACT_ID = Symbol('html');

export default class Meta extends React.PureComponent<Props> {
  private removeMeta?: ReturnType<InstanceType<typeof Manager>['addMeta']>;

  componentWillUnmount() {
    if (this.removeMeta) {
      this.removeMeta();
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
              if (this.removeMeta) {
                this.removeMeta();
              }

              this.removeMeta = manager.addMeta(this.props);
            }}
          />
        )}
      </Context.Consumer>
    );
  }
}
