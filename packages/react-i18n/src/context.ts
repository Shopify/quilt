import * as React from 'react';
import {I18nManager} from './manager';
import {I18n} from './i18n';

export const I18nContext = React.createContext<I18nManager | null>(null);
export const I18nParentsContext = React.createContext<I18n | null>(null);
