import * as React from 'react';
import {Toast} from '@shopify/polaris';

export const ToastContext = React.createContext<ToastActions>({
  show: noop,
  hide: noop,
});

export interface ToastDescription {
  content: string;
  error?: boolean;
  dismissible?: boolean;
  duration?: number;
  onDismiss?(): void;
}

export interface ToastActions {
  show(options: ToastDescription): void;
  hide(): void;
}

export interface Props {
  children: any;
}

export function ToastProvider({children}: Props) {
  const [toasts, setToasts] = React.useState<ToastDescription[]>([]);

  const show = (toast: ToastDescription) => {
    setToasts([...toasts, toast]);
  };

  const hide = () => {
    setToasts([]);
  };

  const toastMarkup = toasts.map(({content, error, duration, onDismiss}) => (
    <Toast
      key={content}
      onDismiss={onDismiss || noop}
      error={error}
      duration={duration}
      content={content}
    />
  ));

  return (
    <ToastContext.Provider value={{show, hide}}>
      {children}
      {toastMarkup}
    </ToastContext.Provider>
  );
}

export const useToast = () => React.useContext(ToastContext);

function noop() {}
