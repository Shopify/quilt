import React from 'react';
import hoistStatics from 'hoist-non-react-statics';
import {RegisterOptions} from './manager';
import {useI18n} from './hooks';
import I18n from './i18n';

export interface WithI18nProps {
  i18n: I18n;
}

export function withI18n(i18nOptions?: RegisterOptions) {
  return <P extends WithI18nProps>(
    WrappedComponent: React.ComponentType<P>,
  ): React.ComponentType<P> => {
    function WithTranslations(props: any) {
      const [i18n, ShareTranslations] = useI18n(i18nOptions);
      const {children} = props;

      return (
        <ShareTranslations>
          <WrappedComponent {...props} i18n={i18n}>
            {children}
          </WrappedComponent>
        </ShareTranslations>
      );
    }

    return hoistStatics(WithTranslations, WrappedComponent);
  };
}
