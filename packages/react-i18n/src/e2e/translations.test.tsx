import * as React from 'react';
import {mount} from 'enzyme';
import {useI18n, I18nContext, I18nManager} from '..';

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
});
