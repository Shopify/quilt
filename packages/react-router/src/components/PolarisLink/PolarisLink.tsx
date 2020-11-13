import React from 'react';

import {Link} from '../Link';

// wishing I can export this from polaris instead
// but also, do I? I dont want it as a dependency to react-router
interface Props extends React.HTMLProps<HTMLAnchorElement> {
  url: string;
  children?: React.ReactNode;
  external?: boolean;
  download?: string | boolean;
  [key: string]: any;
}

export function PolarisLink({children, url = '', external, ...rest}: Props) {
  const target = external ? '_blank' : rest.target;
  const rel = external ? 'noopener noreferrer' : rest.rel;

  return (
    <Link url={url} skipRouter={external} target={target} rel={rel} {...rest}>
      {children}
    </Link>
  );
}
