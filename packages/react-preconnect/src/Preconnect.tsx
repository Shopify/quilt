import React from 'react';
import {Helmet} from 'react-helmet';

export interface Props {
  hosts: string[];
}

export default function Preconnect({hosts}: Props) {
  const preconnectLinks = hosts.map(host => (
    <link key={host} rel="dns-prefetch preconnect" href={`//${host}`} />
  ));

  return <Helmet>{preconnectLinks}</Helmet>;
}
