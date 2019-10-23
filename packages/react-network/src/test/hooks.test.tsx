import React from 'react';
import {createMount} from '@shopify/react-testing';
import {Header} from '@shopify/network';
import {FirstArgument} from '@shopify/useful-types';
import {NetworkManager} from '../manager';
import {NetworkContext} from '../context';
import {useAcceptLanguage} from '../hooks';

describe('useAcceptLanguage()', () => {
  function MockComponent({
    fallback,
  }: {
    fallback?: FirstArgument<typeof useAcceptLanguage>;
  }) {
    const locales = useAcceptLanguage(fallback);

    const localeCodes = locales.map(local => local.code).join(' ');
    return <>{localeCodes}</>;
  }

  it('returns the locale from the language header', async () => {
    const language = 'it';
    const wrapper = await mount(<MockComponent />, {language});

    expect(wrapper).toContainReactText(language);
  });

  it('parses codes from multiple languages in various formats', async () => {
    const language = 'fr-CH, fr;q=0.9, en;q=0.8, de;q=0.7, *;q=0.5';
    const wrapper = await mount(<MockComponent />, {language});

    expect(wrapper).toContainReactText('fr fr en de *');
  });

  it('returns a fallback when no language header exists', async () => {
    const fallback = 'fr';
    const wrapper = await mount(
      <MockComponent fallback={{code: fallback, quality: 1.0}} />,
    );

    expect(wrapper).toContainReactText(fallback);
  });

  it('returns `en` if no fallback is set and no language header exists', async () => {
    const wrapper = await mount(<MockComponent />);

    expect(wrapper).toContainReactText('en');
  });
});

const mount = createMount<{language?: string}>({
  render: (element, _, {language}) => {
    const headers = {};

    if (language) {
      headers[Header.AcceptLanguage] = language;
    }

    const manager = new NetworkManager({headers});

    return (
      <NetworkContext.Provider value={manager}>
        {element}
      </NetworkContext.Provider>
    );
  },
});
