import * as React from 'react';
import {ToastDescription} from './types';

export interface Actions {
  show(options: ToastDescription): void;
  hide(): void;
}

export const Context = React.createContext<Actions>({
  show: noop,
  hide: noop,
});

function noop() {}
