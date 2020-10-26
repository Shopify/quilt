import React from 'react';
import {Link as ReactRouterLink, LinkProps} from 'react-router-dom';

type ReactRouterLinkProps = Omit<LinkProps, 'to'>;

export interface Props extends ReactRouterLinkProps {
  external?: boolean;
  url: string;
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
