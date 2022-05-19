import React from 'react';
import {mount} from '@shopify/react-testing';

import {MUSTACHE_FORMAT} from '../../utilities';
import {I18nManager} from '../../manager';
import {useI18n} from '../../hooks';
import {I18nContext} from '../../context';

const enTranslations = {hello: 'Hello'};
const frTranslations = {hello: 'Bonjour'};

describe('translations', () => {
  it('uses a translation map', () => {
    function WithI18nComponent() {
      const [i18n] = useI18n({
        id: 'MyComponent',
        translations: {en: enTranslations, fr: frTranslations},
      });

      return <div>{i18n.translate('hello')}</div>;
    }

    const manager = new I18nManager({locale: 'fr'});
    const component = mount(
      <I18nContext.Provider value={manager}>
        <WithI18nComponent />
      </I18nContext.Provider>,
    );

    expect(component.text()).toBe(frTranslations.hello);
  });

  it('uses a translation getter', () => {
    function WithI18nComponent() {
      const [i18n] = useI18n({
        id: 'MyComponent',
        translations(locale) {
          switch (locale) {
            case 'en':
              return enTranslations;
            case 'fr':
              return frTranslations;
          }

          throw new Error('No translations found');
        },
      });

      return <div>{i18n.translate('hello')}</div>;
    }

    const manager = new I18nManager({locale: 'en'});
    const component = mount(
      <I18nContext.Provider value={manager}>
        <WithI18nComponent />
      </I18nContext.Provider>,
    );

    expect(component.text()).toBe(enTranslations.hello);
  });

  it('uses custom interpolation', () => {
    function WithI18nComponent() {
      const [i18n] = useI18n({
        id: 'MyComponent',
        fallback: {hello: 'Hello {{name}} {{ surname }}!'},
      });

      return (
        <div>{i18n.translate('hello', {name: 'foo', surname: 'bar'})}</div>
      );
    }

    const manager = new I18nManager({
      locale: 'en',
      interpolate: MUSTACHE_FORMAT,
    });
    const component = mount(
      <I18nContext.Provider value={manager}>
        <WithI18nComponent />
      </I18nContext.Provider>,
    );

    expect(component.text()).toBe('Hello foo bar!');
  });
});
