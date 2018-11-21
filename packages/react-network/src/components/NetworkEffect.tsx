import * as React from 'react';
import {Effect} from '@shopify/react-effect';

import {Consumer} from '../context';
import {Manager} from '../manager';

interface Props {
  perform(manager: Manager): void;
}

export const EFFECT_ID = Symbol('network');

export default function NetworkEffect({perform}: Props) {
  if (typeof window !== 'undefined') {
    return null;
  }

  return (
    <Consumer>
      {manager => (
        <Effect serverOnly kind={EFFECT_ID} perform={() => perform(manager)} />
      )}
    </Consumer>
  );
}
