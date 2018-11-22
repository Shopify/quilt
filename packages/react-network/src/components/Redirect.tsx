import * as React from 'react';
import {StatusCode} from '@shopify/network';
import NetworkEffect from './NetworkEffect';

interface Props {
  url: string;
  status?: StatusCode;
}

export default function Redirect({url, status}: Props) {
  return (
    <NetworkEffect
      perform={manager => {
        manager.redirectTo(url, status);
      }}
    />
  );
}
