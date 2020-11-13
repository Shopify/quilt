import React from 'react';
import {Link as ReactRouterLink, LinkProps} from 'react-router-dom';

type ReactRouterLinkProps = Omit<LinkProps, 'to'>;

export interface Props extends ReactRouterLinkProps {
  skipRouter?: boolean;
  url: string;
}

export function Link(props: Props) {
  const {url, skipRouter, children, ...rest} = props;
  if (skipRouter || isNonHttpProtocol(url)) {
    return (
      <a href={url} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <ReactRouterLink to={url} {...rest}>
      {children}
    </ReactRouterLink>
  );
}

const CUSTOM_PROTOCOL_REGEX = /^(?!http)\w+:/;

export function isNonHttpProtocol(url: string) {
  return CUSTOM_PROTOCOL_REGEX.test(url);
}
