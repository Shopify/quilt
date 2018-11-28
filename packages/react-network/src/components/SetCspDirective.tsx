import * as React from 'react';
import {CspDirective} from '@shopify/network';
import NetworkEffect from './NetworkEffect';

interface Props {
  directive: CspDirective;
  value: boolean | string | string[];
}

export default function SetCspDirective({directive, value}: Props) {
  return (
    <NetworkEffect
      perform={manager => manager.addCspDirective(directive, value)}
    />
  );
}
