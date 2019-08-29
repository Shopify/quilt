import React from 'react';
import {mount} from '@shopify/react-testing';
import {Header} from '@shopify/network';
import {NetworkManager} from '../manager';
import {NetworkContext} from '../context';
import {useAcceptLanguages} from '../hooks';

describe('useAcceptLanguages()', () => {
  function MockComponent({fallback}: {fallback?: string}) {
    const [local] = useAcceptLanguages(fallback);

    return <>{local}</>;
  }

  it('returns the locale from the language header', async () => {
    const lang = 'it';
    const wrapper = await mountWithLanguageHeader(<MockComponent />, lang);

    expect(wrapper.find(MockComponent)).toContainReactText(lang);
  });

  it('returns the first locale from the language header with multiple languages', async () => {
    const lang = 'it, fr, en-US';
    const wrapper = await mountWithLanguageHeader(<MockComponent />, lang);

    expect(wrapper.find(MockComponent)).toContainReactText('it');
  });

  it('returns a fallback when no language header exists', async () => {
    const fallback = 'fr';
    const wrapper = await mountWithLanguageHeader(
      <MockComponent fallback={fallback} />,
    );

    expect(wrapper.find(MockComponent)).toContainReactText(fallback);
  });

  it('returns `en` if no fallback is set and no language header exists', async () => {
    const wrapper = await mountWithLanguageHeader(<MockComponent />);

    expect(wrapper.find(MockComponent)).toContainReactText('en');
  });
});

function mountWithLanguageHeader(
  component: React.ReactElement,
  local?: string,
) {
  const headers = {};

  if (local) {
    headers[Header.AcceptLanguage] = local;
  }

  const manager = new NetworkManager({headers});

  return mount(
    <NetworkContext.Provider value={manager}>
      {component}
    </NetworkContext.Provider>,
  );
}
