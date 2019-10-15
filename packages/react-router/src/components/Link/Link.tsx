import React from 'react';
import {Link as ReactRouterLink} from 'react-router-dom';

export interface Props {
  external?: boolean;
  url: string;
  children?: React.ReactNode;
}

export default function Link({url, external, children, ...rest}: Props) {
  let target: string | undefined;
  let rel: string | undefined;
  if (external) {
    target = '_blank';
    rel = 'noopener noreferrer';
  }

  return (
    <ReactRouterLink target={target} to={url} rel={rel} {...rest}>
      {children}
    </ReactRouterLink>
  );
}
