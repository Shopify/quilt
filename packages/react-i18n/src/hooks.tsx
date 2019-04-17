import * as React from 'react';

import {I18n} from './i18n';
import {I18nManager, RegisterOptions} from './manager';
import {I18nContext, I18nIdsContext, I18nParentContext} from './context';

export function useI18n(options?: Partial<RegisterOptions>): [
  I18n,
  React.ComponentType<{children: React.ReactNode}>
] {
  const manager = React.useContext(I18nContext);

  if (manager == null) {
    throw new Error(
      'Missing i18n manager. Make sure to use an <I18nContext.Provider /> somewhere in your React tree.',
    );
  }

  const registerOptions = React.useRef(options);

  if (shouldRegister(registerOptions.current) !== shouldRegister(options)) {
    throw new Error('You switched between providing registration options and not providing them, which is not supported.');
  }

  if (options == null) {
    return useSimpleI18n(manager);
  } else {
    return useComplexI18n(options!, manager);
  }
}

function useComplexI18n({
  id,
  fallback,
  translations,
}: Partial<RegisterOptions>, manager: I18nManager) {
  const parentIds = React.useContext(I18nIdsContext);

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
          <I18nIdsContext.Provider value={ids}>
            <I18nParentContext.Provider value={i18n}>
              {children}
            </I18nParentContext.Provider>
          </I18nIdsContext.Provider>
        );
      },
    [i18n, ids],
  );

  return [i18n, ShareTranslations];
}

function useSimpleI18n(manager: I18nManager) {
  const i18n =
    React.useContext(I18nParentContext) || new I18n([], manager.details);

  return [i18n, IdentityComponent];
}

function IdentityComponent({children}: {children: React.ReactNode}) {
  return children;
}

function shouldRegister({fallback, translations}: Partial<RegisterOptions> = {}) {
  return fallback != null || translations != null;
}
