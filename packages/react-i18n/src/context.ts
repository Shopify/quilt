import * as React from 'react';
import Manager from './manager';

export const I18nContext = React.createContext<Manager | undefined>(undefined);
export const I18nParentsContext = React.createContext<string[]>([]);
