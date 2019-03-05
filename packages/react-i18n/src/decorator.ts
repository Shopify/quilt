import React from 'react';
import {RegisterOptions} from './manager';
import {useI18n} from './hooks';
import I18n from './i18n';

export interface WithI18nProps {
  i18n: I18n;
}

export function withI18n(i18nOptions: RegisterOptions) {
  return <P extends WithI18nProps>(
    WrappedComponent: React.ComponentType<P>,
  ): React.ComponentType<P> => props => {
    const [i18n] = useI18n(i18nOptions);
    return React.createElement(WrappedComponent, {
      ...(props as any),
      i18n,
    });
  };
}
