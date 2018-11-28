import * as React from 'react';
import Manager from './manager';

const {Provider, Consumer} = React.createContext<Manager>(new Manager());

interface Props {
  manager?: Manager;
  children: React.ReactNode;
}

function HtmlManagerProvider({manager, children}: Props) {
  return manager ? (
    <Provider value={manager}>{children}</Provider>
  ) : (
    <>{children}</>
  );
}

export {HtmlManagerProvider as Provider, Consumer};
