import React from 'react';

export interface Props extends React.StyleHTMLAttributes<HTMLStyleElement> {
  children: string;
}

export function Style(props: Props) {
  return <style type="text/css" {...props} />;
}
