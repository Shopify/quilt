import React from 'react';
import {useLazyRef} from '@shopify/react-hooks';

import {I18n} from './i18n';
import {I18nManager, RegisterOptions} from './manager';
import {I18nContext, I18nIdsContext, I18nParentContext} from './context';

type Result = [I18n, React.ComponentType<{children: React.ReactNode}>];

export function useI18n(options?: Partial<RegisterOptions>): Result {
  const manager = React.useContext(I18nContext);

  if (manager == null) {
    throw new Error(
      'Missing i18n manager. Make sure to use an <I18nContext.Provider /> somewhere in your React tree.',
    );
  }

  const registerOptions = React.useRef(options);

  if (shouldRegister(registerOptions.current) !== shouldRegister(options)) {
    throw new Error(
      'You switched between providing registration options and not providing them, which is not supported.',
    );
  }

  // Yes, this would usually be dangerous. But just above this line, we check to make
  // sure that they never switch from the case where `options == null` to `options != null`,
  // so we know that a given use of this hook will only ever hit one of these two cases.
  /* eslint-disable react-hooks/rules-of-hooks */
  if (options == null) {
    return useSimpleI18n(manager);
  } else {
    return useComplexI18n(options, manager);
  }
  /* eslint-enable react-hooks/rules-of-hooks */
}

function useComplexI18n(
  {id, fallback, translations}: Partial<RegisterOptions>,
  manager: I18nManager,
): Result {
  const managerRef = React.useRef<I18nManager | null>(null);
  const unsubscribeRef = React.useRef<ReturnType<I18nManager['subscribe']>>(
    noop,
  );
  const parentIds = React.useContext(I18nIdsContext);

  // Parent IDs can only change when a parent gets added/ removed,
  // which would cause the component using `useI18n` to unmount.
  // We also don't support the `id` changing between renders. For these
  // reasons, it's safe to just store the IDs once and never let them change.
  const ids = useLazyRef(() => (id ? [id, ...parentIds] : parentIds));

  // When the manager changes, we need to do the following IMMEDIATELY (i.e.,
  // not in a useEffect callback):
  //
  // 1. Register the component’s translations. This ensures that the first render gets
  //    the synchronous translations, if available.
  // 2. Unsubscribe from changes to a previous manager.
  // 3. Subscribe to changes from the new manager. This ensures that if the subscription
  //    is updated between render and `useEffect`, the state update is not lost.
  if (manager !== managerRef.current) {
    managerRef.current = manager;

    unsubscribeRef.current();
    unsubscribeRef.current = manager.subscribe(
      ids.current,
      ({translations, loading}, details) => {
        const newI18n = new I18n(translations, {...details, loading});
        i18nRef.current = newI18n;
        setI18n(newI18n);
      },
    );

    if (id && (translations || fallback)) {
      manager.register({id, translations, fallback});
    }
  }

  const [i18n, setI18n] = React.useState(() => {
    const managerState = manager.state(ids.current);
    const {translations, loading} = managerState;
    return new I18n(translations, {...manager.details, loading});
  });

  const i18nRef = React.useRef(i18n);

  React.useEffect(() => {
    return unsubscribeRef.current;
  }, []);

  // We use refs in this component so that it never changes. If this component
  // is regenerated, it will unmount the entire tree of the previous component,
  // which is usually not desirable. Technically, this does leave surface area
  // for a bug to sneak in: if the component that renders this does so inside
  // a component that blocks the update from passing down, nothing will force
  // this component to re-render, so no descendants will get the new ids/ i18n
  // value. Because we don't actually have any such cases, we're OK with this
  // for now.
  const shareTranslationsComponent = useLazyRef(
    () =>
      function ShareTranslations({children}: {children: React.ReactNode}) {
        return (
          <I18nIdsContext.Provider value={ids.current}>
            <I18nParentContext.Provider value={i18nRef.current}>
              {children}
            </I18nParentContext.Provider>
          </I18nIdsContext.Provider>
        );
      },
  );

  return [i18n, shareTranslationsComponent.current];
}

function useSimpleI18n(manager: I18nManager): Result {
  const i18n =
    React.useContext(I18nParentContext) || new I18n([], manager.details);

  return [i18n, IdentityComponent];
}

function IdentityComponent({children}: {children: React.ReactNode}) {
  return <>{children}</>;
}

function shouldRegister({
  fallback,
  translations,
}: Partial<RegisterOptions> = {}) {
  return fallback != null || translations != null;
}

function noop() {}
