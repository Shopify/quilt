import * as React from 'react';

import {I18n} from './i18n';
import {RegisterOptions} from './manager';
import {I18nContext, I18nParentsContext} from './context';

export function useI18n({
  id,
  fallback,
  translations,
}: Partial<RegisterOptions> = {}): [
  I18n,
  React.ComponentType<{children: React.ReactNode}>
] {
  const manager = React.useContext(I18nContext);

  if (manager == null) {
    throw new Error(
      'Missing i18n manager. Make sure to use an <I18nContext.Provider /> somewhere in your React tree.',
    );
  }

  const parentI18n = React.useContext(I18nParentsContext);
  const parentIds = parentI18n ? parentI18n.ids || [] : [];
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const ids = React.useMemo(() => (id ? [id, ...parentIds] : parentIds), [
    id,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    ...parentIds,
  ]);

  if (id && (translations || fallback)) {
    manager.register({id, translations, fallback});
  }

  const [i18n, setI18n] = React.useState(() => {
    const {translations} = manager.state(ids);
    return new I18n(translations, manager.details, ids);
  });

  React.useEffect(
    () => {
      return manager.subscribe(ids, ({translations}, details) => {
        setI18n(new I18n(translations, details, ids));
      });
    },
    [ids, manager],
  );

  const ShareTranslations = React.useMemo(
    () =>
      function ShareTranslations({children}: {children: React.ReactNode}) {
        return (
          <I18nParentsContext.Provider value={i18n}>
            {children}
          </I18nParentsContext.Provider>
        );
      },
    [i18n],
  );

  return [i18n, ShareTranslations];
}

export function useSimpleI18n() {
  const manager = React.useContext(I18nContext);

  if (manager == null) {
    throw new Error(
      'Missing i18n manager. Make sure to use an <I18nContext.Provider /> somewhere in your React tree.',
    );
  }

  const i18n =
    React.useContext(I18nParentsContext) || new I18n([], manager.details);

  return i18n;
}
