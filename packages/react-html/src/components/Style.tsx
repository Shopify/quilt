import * as React from 'react';

export interface Props extends React.LinkHTMLAttributes<HTMLLinkElement> {
  href: string;
}

export function Style(props: Props) {
  return <link rel="stylesheet" type="text/css" {...props} />;
}
