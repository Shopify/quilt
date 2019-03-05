import * as React from 'react';
import {I18nContext} from './context';
import Manager from './manager';

interface Props {
  manager?: Manager;
  children: React.ReactNode;
}

export function Provider({manager, children}: Props) {
  return (
    <I18nContext.Provider value={manager}>{children}</I18nContext.Provider>
  );
}
