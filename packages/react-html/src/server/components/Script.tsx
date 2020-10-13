import React from 'react';

export interface Props extends React.ScriptHTMLAttributes<HTMLScriptElement> {
  src: string;
}

export function Script(props: Props) {
  return <script type="text/javascript" {...props} />;
}
