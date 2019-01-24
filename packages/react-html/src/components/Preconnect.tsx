import * as React from 'react';
import Link from './Link';

interface Props {
  source: string;
}

export default function Preconnect({source}: Props) {
  return <Link rel="dns-prefetch preconnect" href={source} />;
}
