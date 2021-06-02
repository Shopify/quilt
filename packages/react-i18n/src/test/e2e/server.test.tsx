/**
 * @jest-environment node
 */

import '../matchers';

import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {extract, Effect} from '@shopify/react-effect/server';

import {I18nManager} from '../../manager';
import {useI18n} from '../../hooks';
import {I18nContext} from '../../context';

const fallbackTranslations = {MyComponent: {hello: 'Hello'}};
const frTranslations = {MyComponent: {hello: 'Bonjour'}};
const frCATranslations = {MyComponent: {hello: 'Allo Bonjour'}};

function WithI18nComponent({children}: {children?: React.ReactNode}) {
  const [i18n, ShareTranslations] = useI18n({
    id: 'MyComponent',
    fallback: fallbackTranslations,
    translations(locale) {
      switch (locale) {
        case 'fr-CA':
          return frCATranslations;
        case 'fr':
          return frTranslations;
        default:
          return undefined;
      }
    },
  });

  return (
    <>
      {i18n.translate('MyComponent.hello')}
      <ShareTranslations>{children}</ShareTranslations>
    </>
  );
}

function WithAsyncI18nComponent({children}: {children?: React.ReactNode}) {
  const [i18n, ShareTranslations] = useI18n({
    id: 'MyComponent',
    fallback: fallbackTranslations,
    translations(locale) {
      switch (locale) {
        case 'fr-CA':
          return defer(frCATranslations);
        case 'fr':
          return defer(frTranslations);
        default:
          return undefined;
      }
    },
  });

  return (
    <>
      {i18n.translate('MyComponent.hello')}
      <ShareTranslations>{children}</ShareTranslations>
    </>
  );
}

function WithoutOwnI18nComponent({children}: {children?: React.ReactNode}) {
  const [i18n] = useI18n();

  return (
    <>
      {i18n.translate('MyComponent.hello')}
      {children}
    </>
  );
}

describe('server', () => {
  it('allows for synchronously rendering', () => {
    const manager = new I18nManager({locale: 'fr-CA'});
    const markup = renderToStaticMarkup(
      <I18nContext.Provider value={manager}>
        <WithI18nComponent />
      </I18nContext.Provider>,
    );
    expect(markup).toBe(`${frCATranslations.MyComponent.hello}`);
  });

  it('extracts async translations', async () => {
    const manager = new I18nManager({locale: 'fr-CA'});
    const element = (
      <I18nContext.Provider value={manager}>
        <WithAsyncI18nComponent />
        <Effect perform={() => manager.loading && manager.resolve()} />
      </I18nContext.Provider>
    );

    await extract(element);
    const markup = renderToStaticMarkup(element);

    expect(markup).toBe(`${frCATranslations.MyComponent.hello}`);

    const translations = manager.extract();

    const extractedTranslations = Object.values(translations);
    expect(Object.keys(translations)).toBeArrayOfUniqueItems();
    expect(extractedTranslations).toContain(frCATranslations);
    expect(extractedTranslations).toContain(frTranslations);
  });

  it('handles nested translation connections', async () => {
    const manager = new I18nManager({locale: 'fr'});
    const element = (
      <I18nContext.Provider value={manager}>
        <WithAsyncI18nComponent>
          <WithoutOwnI18nComponent />
        </WithAsyncI18nComponent>
        <Effect perform={() => manager.loading && manager.resolve()} />
      </I18nContext.Provider>
    );

    await extract(element);
    const markup = renderToStaticMarkup(element);

    expect(markup).toBe(
      `${frTranslations.MyComponent.hello}${frTranslations.MyComponent.hello}`,
    );
  });
});

function defer<T>(value: T): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(resolve.bind(null, value), 1);
  });
}
