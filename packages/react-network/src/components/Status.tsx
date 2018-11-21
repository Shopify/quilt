import * as React from 'react';
import {StatusCode} from '@shopify/network';
import NetworkEffect from './NetworkEffect';

interface Props {
  code: StatusCode;
}

export default function Status({code}: Props) {
  return (
    <NetworkEffect
      perform={manager => {
        manager.addStatusCode(code);
      }}
    />
  );
}
