import React from 'react';
import {useAcceptLanguage} from '@shopify/react-network';
import {I18nUniversalProvider} from '@shopify/react-i18n-universal-provider';

interface Props {
  children?: React.ReactNode;
}

export function I18n({children}: Props) {
  const fallback = {
    code: typeof window === 'undefined' ? 'en' : navigator.language,
    quality: 1.0,
  };
  const [language] = useAcceptLanguage(fallback);

  return (
    <I18nUniversalProvider locale={language.code}>
      {children}
    </I18nUniversalProvider>
  );
}
