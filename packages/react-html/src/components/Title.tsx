import * as React from 'react';
import {Effect} from '@shopify/react-effect';
import {Consumer} from '../context';
import Manager from '../manager';
import {EFFECT_ID} from '../utilities';

interface Props {
  children: string;
}

export default class Title extends React.PureComponent<Props> {
  private removeTitle?: ReturnType<InstanceType<typeof Manager>['addTitle']>;

  componentWillUnmount() {
    if (this.removeTitle) {
      this.removeTitle();
    }
  }

  render() {
    const {children: title} = this.props;

    return (
      <Consumer>
        {manager => (
          <Effect
            key={title}
            kind={EFFECT_ID}
            perform={() => {
              if (this.removeTitle) {
                this.removeTitle();
              }

              this.removeTitle = manager.addTitle(title);
            }}
          />
        )}
      </Consumer>
    );
  }
}
