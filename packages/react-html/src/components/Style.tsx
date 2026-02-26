import * as React from 'react';

export interface Props extends React.LinkHTMLAttributes<HTMLLinkElement> {
  href: string;
}

export default function Style(props: Props) {
  return <link rel="stylesheet" type="text/css" {...props} />;
}
