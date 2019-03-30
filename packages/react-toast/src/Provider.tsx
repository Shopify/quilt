import * as React from 'react';
import {Context} from './context';
import {ToastDescription} from './types';

export interface Props {
  children: any;
  renderToast(ToastDescription: ToastDescription): React.ElementType;
}

export function Provider({children, renderToast}: Props) {
  const [toasts, setToasts] = React.useState<ToastDescription[]>([]);

  const show = (toast: ToastDescription) => {
    setToasts([...toasts, toast]);
  };

  const hide = () => {
    setToasts([]);
  };

  const toastMarkup = toasts.map(
    ({content, error, duration, onDismiss, dismissible}) =>
      renderToast({content, error, duration, onDismiss, dismissible}),
  );

  return (
    <Context.Provider value={{show, hide}}>
      {children}
      {toastMarkup}
    </Context.Provider>
  );
}
