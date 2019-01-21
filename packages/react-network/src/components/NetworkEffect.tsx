import * as React from 'react';
import {Effect} from '@shopify/react-effect';

import {Consumer} from '../context';
import {Manager} from '../manager';

interface Props {
  perform(manager: Manager): void;
}

export default function NetworkEffect({perform}: Props) {
  if (typeof window !== 'undefined') {
    return null;
  }

  return (
    <Consumer>
      {(manager) => (
        <Effect kind={manager.effect} perform={() => perform(manager)} />
      )}
    </Consumer>
  );
}
