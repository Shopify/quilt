import React from 'react';
import faker from 'faker';
import {extract} from '@shopify/react-effect/server';
import {createMount} from '@shopify/react-testing';
import {HtmlManager, HtmlContext} from '@shopify/react-html';
import {I18nContext, I18nManager} from '@shopify/react-i18n';

import {I18nUniversalProvider} from '../I18nUniversalProvider';

const mount = createMount<{htmlManager?: HtmlManager}>({
  render: (element, _, {htmlManager = new HtmlManager()}) => (
    <HtmlContext.Provider value={htmlManager}>{element}</HtmlContext.Provider>
  ),
});

describe('<I18nUniversalProvider />', () => {
  it('renders an I18nContext and creates an I18nManager using the given data', () => {
    const locale = faker.random.locale();
    const currency = faker.finance.currencyCode();
    const country = faker.address.country();
    const timezone = faker.lorem.word();

    const i18n = mount(
      <I18nUniversalProvider
        locale={locale}
        currency={currency}
        timezone={timezone}
        country={country}
      />,
    );

    expect(i18n).toProvideReactContext(I18nContext, expect.any(I18nManager));
    expect(i18n).toProvideReactContext(
      I18nContext,
      expect.objectContaining({
        details: expect.objectContaining({
          locale,
          timezone,
          currency,
          country,
        }),
      }),
    );
  });

  it('serializes i18n details and reuses them', async () => {
    const htmlManager = new HtmlManager();
    const locale = faker.random.locale();
    const currency = faker.finance.currencyCode();
    const country = faker.address.country();
    const timezone = faker.lorem.word();

    await extract(
      <I18nUniversalProvider
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

    const i18n = mount(<I18nUniversalProvider />, {htmlManager});

    expect(i18n).toProvideReactContext(
      I18nContext,
      expect.objectContaining({
        details: expect.objectContaining({
          locale,
          timezone,
          currency,
          country,
        }),
      }),
    );
  });

  it('overrides serialized data with defined overrides', async () => {
    const htmlManager = new HtmlManager();
    const locale = faker.random.locale();
    const currency = faker.finance.currencyCode();
    const country = faker.address.country();
    const timezone = faker.lorem.word();

    await extract(
      <I18nUniversalProvider
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

    const overrideDetails = {
      locale: faker.random.locale(),
      currency: undefined,
      country: faker.address.country(),
      timezone: undefined,
    };
    const i18n = mount(<I18nUniversalProvider {...overrideDetails} />, {
      htmlManager,
    });

    expect(i18n).toProvideReactContext(
      I18nContext,
      expect.objectContaining({
        details: expect.objectContaining({
          locale: overrideDetails.locale,
          timezone,
          currency,
          country: overrideDetails.country,
        }),
      }),
    );
  });
});
