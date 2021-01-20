import React from 'react';

export interface Props extends React.ScriptHTMLAttributes<HTMLScriptElement> {
  src: string;
}

export function Script(props: Props) {
  const type = props.type ?? 'text/javascript';
  return <script {...props} type={type} />;
}
