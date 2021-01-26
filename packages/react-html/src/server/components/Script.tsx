import React from 'react';

export interface Props extends React.ScriptHTMLAttributes<HTMLScriptElement> {
  src: string;
}

export function Script(props: Props) {
  const {type, defer, ...otherProps} = props;
  const isNoModule = type === 'nomodule';

  const attributes = {
    ...otherProps,
    type: !type || isNoModule ? 'text/javascript' : type,
    defer: type === 'module' ? undefined : defer,
    noModule: isNoModule ? true : undefined,
  };

  return <script {...attributes} />;
}
