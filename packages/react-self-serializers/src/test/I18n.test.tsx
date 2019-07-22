import React from 'react';
import faker from 'faker';
import {HtmlManager, HtmlContext} from '@shopify/react-html';
import {extract} from '@shopify/react-effect/server';
import {I18nContext, I18nManager} from '@shopify/react-i18n';
import {createMount} from '@shopify/react-testing';

import {I18n} from '../I18n';

const mount = createMount<{htmlManager?: HtmlManager}>({
  render: (element, _, {htmlManager = new HtmlManager()}) => (
    <HtmlContext.Provider value={htmlManager}>{element}</HtmlContext.Provider>
  ),
});

describe('<I18n />', () => {
  it('renders an I18nContext.Provider and creates an I18nManager using the given data', () => {
    const locale = faker.random.locale();
    const currency = faker.finance.currencyCode();
    const country = faker.address.country();
    const timezone = faker.lorem.word();

    const i18n = mount(
      <I18n
        locale={locale}
        currency={currency}
        timezone={timezone}
        country={country}
      />,
    );

    expect(i18n).toContainReactComponent(I18nContext.Provider, {
      value: expect.any(I18nManager),
    });

    expect(i18n).toContainReactComponent(I18nContext.Provider, {
      value: expect.objectContaining({
        details: expect.objectContaining({
          locale,
          timezone,
          currency,
          country,
        }),
      }),
    });
  });

  it('serializes i18n details and reuses them', async () => {
    const htmlManager = new HtmlManager();
    const locale = faker.random.locale();
    const currency = faker.finance.currencyCode();
    const country = faker.address.country();
    const timezone = faker.lorem.word();

    await extract(
      <I18n
        locale={locale}
        currency={currency}
        timezone={timezone}
        country={country}
      />,
      {
        decorate: (element: React.ReactNode) => (
          <HtmlContext.Provider value={htmlManager}>
            {element}
          </HtmlContext.Provider>
        ),
      },
    );

    const i18n = mount(<I18n />, {htmlManager});

    expect(i18n).toContainReactComponent(I18nContext.Provider, {
      value: expect.objectContaining({
        details: expect.objectContaining({
          locale,
          timezone,
          currency,
          country,
        }),
      }),
    });
  });
});
