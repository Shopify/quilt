import React from 'react';

export interface Props extends React.LinkHTMLAttributes<HTMLLinkElement> {
  href: string;
}

export function Stylesheet(props: Props) {
  return <link rel="stylesheet" type="text/css" {...props} />;
}
