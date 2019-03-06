import * as React from 'react';

import I18n from './i18n';
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
    throw new Error('Missing manager');
  }

  const parentIds = React.useContext(I18nParentsContext);
  const ids = React.useMemo(() => (id ? [id, ...parentIds] : parentIds), [
    id,
    ...parentIds,
  ]);

  if (id && (translations || fallback)) {
    manager.register({id, translations, fallback});
  }

  const [i18n, setI18n] = React.useState(() => {
    const translations = manager.state(ids);
    return new I18n(translations, manager.details);
  });

  React.useEffect(
    () => {
      return manager.subscribe(ids, (translations, details) => {
        setI18n(new I18n(translations, details));
      });
    },
    [manager],
  );

  const ShareTranslations = React.useMemo(
    () =>
      function ShareTranslations({children}: {children: React.ReactNode}) {
        return (
          <I18nParentsContext.Provider value={ids}>
            {children}
          </I18nParentsContext.Provider>
        );
      },
    [i18n],
  );

  return [i18n, ShareTranslations];
}
