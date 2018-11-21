import * as React from 'react';
import {Manager, NoopManager} from './manager';

const {Consumer, Provider} = React.createContext<Manager>(new NoopManager());

interface Props {
  manager?: Manager;
  children: React.ReactNode;
}

function NetworkManagerProvider({manager, children}: Props) {
  return manager ? (
    <Provider value={manager}>{children}</Provider>
  ) : (
    <>{children}</>
  );
}

export {Consumer, NetworkManagerProvider as Provider};
