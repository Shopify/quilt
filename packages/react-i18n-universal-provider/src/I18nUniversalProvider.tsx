import React from 'react';
import {useLazyRef} from '@shopify/react-hooks';
import {useSerialized, useHtmlAttributes} from '@shopify/react-html';
import {I18nContext, I18nDetails, I18nManager} from '@shopify/react-i18n';

import {combinedI18nDetails} from './utilities';

interface Props extends Partial<I18nDetails> {
  children?: React.ReactNode;
}

interface Serialized extends Partial<I18nDetails> {
  translations: ReturnType<I18nManager['extract']>;
}

/**
 * A self-serializing provider for `@shopify/i18n`'s I18nManager.
 * On the server it serializes its props to the DOM; on the client it retrieves the serialized props and rehydrates them.
 *
 * @param props an object containing the React children to render and any options to use when configuring the tree's `I18nManager`
 * @returns JSX wrapping the given children in an `<I18nContext.Provider>` and a `<Serialize />` component.
 */
export function I18nUniversalProvider({
  children,
  ...explicitI18nDetails
}: Props) {
  const [serialized, Serialize] = useSerialized<Serialized>('i18n');

  const i18nDetails: I18nDetails = combinedI18nDetails(
    serialized,
    explicitI18nDetails,
  );

  const manager = useLazyRef(
    () =>
      new I18nManager(
        i18nDetails,
        serialized ? serialized.translations : undefined,
      ),
  ).current;

  useHtmlAttributes({lang: i18nDetails.locale});

  const {onError, ...primitiveI18nDetails} = i18nDetails;

  return (
    <>
      <I18nContext.Provider value={manager}>{children}</I18nContext.Provider>
      <Serialize
        data={() => {
          const getData = () => ({
            translations: manager.extract(),
            ...primitiveI18nDetails,
          });

          if (manager.loading) {
            return manager.resolve().then(getData);
          }

          return getData();
        }}
      />
    </>
  );
}
