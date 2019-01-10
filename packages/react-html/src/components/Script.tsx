import * as React from 'react';

export interface Props extends React.ScriptHTMLAttributes<HTMLScriptElement> {
  src: string;
  rel?: string;
  as?: string;
}

export default function Script(props: Props) {
  return <script type="text/javascript" {...props} />;
}
