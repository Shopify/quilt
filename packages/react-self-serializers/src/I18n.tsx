import React, {useRef} from 'react';

import {useSerialized, useHtmlAttributes} from '@shopify/react-html';
import {I18nContext, I18nDetails, I18nManager} from '@shopify/react-i18n';

interface Props extends Partial<I18nDetails> {
  children?: React.ReactNode;
}

interface Serialized {
  i18nDetails: I18nDetails;
  translations: ReturnType<I18nManager['extract']>;
}

/**
 * A self-serializing provider for `@shopify/i18n`'s I18nManager.
 * On the server it serializes it's props to the DOM, on the client it retrieves the serialized props and rehydrates using them.
 *
 * @param props an object containing the React children to render and any options to use when configuring the `I18nManager` to provide to the tree
 * @returns JSX wrapping the given children in an `<I18nContext.Provider>` and a `<Serialize />` component.
 */
export function I18n({children, ...givenI18nDetails}: Props) {
  const [serialized, Serialize] = useSerialized<Serialized>('i18n');

  const i18nDetails: I18nDetails = {
    // @ts-ignore
    locale: givenI18nDetails.fallbackLocale || 'en',
    ...givenI18nDetails,
    ...(serialized ? serialized.i18nDetails : {}),
  };

  const manager = useRef(
    new I18nManager(
      i18nDetails,
      serialized ? serialized.translations : undefined,
    ),
  );

  useHtmlAttributes({lang: i18nDetails.locale});

  return (
    <>
      <I18nContext.Provider value={manager.current}>
        {children}
      </I18nContext.Provider>
      <Serialize
        data={() => {
          const getData = () => ({
            translations: manager.current.extract(),
            i18nDetails,
          });

          if (manager.current.loading) {
            return manager.current.resolve().then(getData);
          }

          return getData();
        }}
      />
    </>
  );
}
