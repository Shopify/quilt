import React from 'react';

export interface Props extends React.StyleHTMLAttributes<HTMLStyleElement> {
  children: string;
}

export function InlineStyle(props: Props) {
  return <style type="text/css" {...props} />;
}
