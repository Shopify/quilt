import React from 'react';
import hoistStatics from 'hoist-non-react-statics';
import {NonReactStatics} from '@shopify/useful-types';

import {RegisterOptions} from './manager';
import {useI18n} from './hooks';
import {I18n} from './i18n';

export interface WithI18nProps {
  i18n: I18n;
}

export function withI18n(i18nOptions?: RegisterOptions) {
  return <OwnProps, C>(
    WrappedComponent: React.ComponentType<OwnProps & WithI18nProps> & C,
  ): React.ComponentType<OwnProps> &
    NonReactStatics<typeof WrappedComponent> => {
    function WithTranslations(props: OwnProps) {
      const [i18n, ShareTranslations] = useI18n(i18nOptions);

      return (
        <ShareTranslations>
          <WrappedComponent {...(props as any)} i18n={i18n} />
        </ShareTranslations>
      );
    }

    const wrappedComponentName =
      WrappedComponent.displayName || WrappedComponent.name || 'Component';
    WithTranslations.displayName = `withI18n(${wrappedComponentName})`;

    return hoistStatics(WithTranslations, WrappedComponent) as any;
  };
}
