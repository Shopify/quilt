import * as React from 'react';
import Link from './Link';

interface Props {
  source: string;
}

export default function Favicon({source}: Props) {
  return <Link rel="shortcut icon" type="image/x-icon" href={source} />;
}
