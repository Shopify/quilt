import * as React from 'react';
import {Helmet} from 'react-helmet';

export interface Props {
  host: string | string[];
}

export default function Preconnect({host}: Props) {
  const hosts = Array.isArray(host) ? host : [host];
  const preconnectLinks = hosts.map(aHost => (
    <link key={aHost} rel="dns-prefetch preconnect" href={`//${aHost}`} />
  ));

  return <Helmet>{preconnectLinks}</Helmet>;
}
