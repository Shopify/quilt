import * as React from 'react';
import {mount} from 'enzyme';
import {withI18n, WithI18nProps, Provider, Manager} from '..';

const enTranslations = {hello: 'Hello'};
const frTranslations = {hello: 'Bonjour'};

function SimpleComponent({i18n}: WithI18nProps & {children?: React.ReactNode}) {
  return <div>{i18n.translate('hello')}</div>;
}

describe('translations', () => {
  it('uses a translation map', () => {
    const WithI18nComponent = withI18n({
      id: 'MyComponent',
      translations: {en: enTranslations, fr: frTranslations},
    })(SimpleComponent);

    const manager = new Manager({locale: 'fr'});
    const component = mount(
      <Provider manager={manager}>
        <WithI18nComponent />
      </Provider>,
    );

    expect(component.text()).toBe(frTranslations.hello);
  });

  it('uses a translation getter', () => {
    const WithI18nComponent = withI18n({
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
    })(SimpleComponent);

    const manager = new Manager({locale: 'en'});
    const component = mount(
      <Provider manager={manager}>
        <WithI18nComponent />
      </Provider>,
    );

    expect(component.text()).toBe(enTranslations.hello);
  });
});
