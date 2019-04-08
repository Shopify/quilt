import * as React from 'react';
import {I18nManager} from './manager';

export const I18nContext = React.createContext<I18nManager | null>(null);
export const I18nParentsContext = React.createContext<string[]>([]);
