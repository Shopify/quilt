/**
 * @jest-environment node
 */

import '../test/matchers';

import * as React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {extract} from '@shopify/react-effect/server';

import {useI18n, I18nContext, Manager} from '..';

const fallbackTranslations = {MyComponent: {hello: 'Hello'}};
const frTranslations = {MyComponent: {hello: 'Bonjour'}};
const frCATranslations = {MyComponent: {hello: 'Allo Bonjour'}};

function WithI18nComponent({children}: {children?: React.ReactNode}) {
  const [i18n, ShareTranslations] = useI18n({
    id: 'MyComponent',
    fallback: fallbackTranslations,
    translations(locale) {
      switch (locale) {
        case 'fr-ca':
          return frCATranslations;
        case 'fr':
          return frTranslations;
        default:
          return undefined;
      }
    },
  });

  return (
    <div>
      {i18n.translate('MyComponent.hello')}
      <ShareTranslations>{children}</ShareTranslations>
    </div>
  );
}

function WithAsyncI18nComponent({children}: {children?: React.ReactNode}) {
  const [i18n, ShareTranslations] = useI18n({
    id: 'MyComponent',
    fallback: fallbackTranslations,
    translations(locale) {
      switch (locale) {
        case 'fr-ca':
          return defer(frCATranslations);
        case 'fr':
          return defer(frTranslations);
        default:
          return undefined;
      }
    },
  });

  return (
    <div>
      {i18n.translate('MyComponent.hello')}
      <ShareTranslations>{children}</ShareTranslations>
    </div>
  );
}

function WithoutOwnI18nComponent({children}: {children?: React.ReactNode}) {
  const [i18n] = useI18n();

  return (
    <div>
      {i18n.translate('MyComponent.hello')}
      {children}
    </div>
  );
}

describe('server', () => {
  it('allows for synchronously rendering', () => {
    const manager = new Manager({locale: 'fr-ca'});
    const markup = renderToStaticMarkup(
      <I18nContext.Provider value={manager}>
        <WithI18nComponent />
      </I18nContext.Provider>,
    );
    expect(markup).toBe(`<div>${frCATranslations.MyComponent.hello}</div>`);
  });

  it('extracts async translations', async () => {
    const manager = new Manager({locale: 'fr-ca'});
    const element = (
      <I18nContext.Provider value={manager}>
        <WithAsyncI18nComponent />
      </I18nContext.Provider>
    );

    await extract(element);
    const markup = renderToStaticMarkup(element);

    expect(markup).toBe(`<div>${frCATranslations.MyComponent.hello}</div>`);

    const translations = manager.extract();

    // @ts-ignore (Object.values)
    const extractedTranslations = Object.values(translations);
    expect(Object.keys(translations)).toBeArrayOfUniqueItems();
    expect(extractedTranslations).toContain(frCATranslations);
    expect(extractedTranslations).toContain(frTranslations);
  });

  it('handles nested translation connections', async () => {
    const manager = new Manager({locale: 'fr'});
    const element = (
      <I18nContext.Provider value={manager}>
        <WithAsyncI18nComponent>
          <WithoutOwnI18nComponent />
        </WithAsyncI18nComponent>
      </I18nContext.Provider>
    );

    await extract(element);
    const markup = renderToStaticMarkup(element);

    expect(markup).toBe(
      `<div>${frTranslations.MyComponent.hello}<div>${
        frTranslations.MyComponent.hello
      }</div></div>`,
    );
  });
});

function defer<T>(value: T): Promise<T> {
  return new Promise(resolve => {
    setTimeout(resolve.bind(null, value), 1);
  });
}
