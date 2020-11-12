import React from 'react';
import {Link as ReactRouterLink, LinkProps} from 'react-router-dom';

type ReactRouterLinkProps = Omit<LinkProps, 'to'>;

export interface Props extends ReactRouterLinkProps {
  external?: boolean;
  url: string;
}

const EXTERNAL_LINK_REGEX = /^(?:[a-z][a-z\d+.-]*:|\/\/)/;

export default function Link(props: Props) {
  const {url, external, children, ...rest} = props;
  if (external || EXTERNAL_LINK_REGEX.test(url)) {
    return (
      <a href={url} {...rest} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }

  return (
    <ReactRouterLink to={url} {...props}>
      {children}
    </ReactRouterLink>
  );
}
