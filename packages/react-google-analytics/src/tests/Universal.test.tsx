import React from 'react';
import ImportRemote from '@shopify/react-import-remote';
import {mount} from '@shopify/react-testing';

import Universal, {
  Props,
  SETUP_SCRIPT,
  UNIVERSAL_GA_SCRIPT,
  UNIVERSAL_GA_DEBUG_SCRIPT,
} from '../Universal';

jest.mock('@shopify/react-import-remote', () => () => null);

describe('<Universal />', () => {
  const mockProps: Props = {
    account: 'abc',
    domain: 'myshopify.com',
  };

  describe('setup script', () => {
    it('renders a script tag with the setup content', () => {
      const universal = mount(<Universal {...mockProps} />);
      expect(universal).toContainReactComponent('script', {
        dangerouslySetInnerHTML: {__html: SETUP_SCRIPT},
      });
    });
  });

  it('passes nonce prop to script tag', () => {
    const nonce = '123';
    const universal = mount(<Universal {...mockProps} nonce={nonce} />);
    expect(universal.find('script')).toHaveReactProps({nonce});
  });

  it('passes nonce prop to <ImportRemote />', () => {
    const nonce = '123';
    const universal = mount(<Universal {...mockProps} nonce={nonce} />);
    expect(universal.find(ImportRemote)).toHaveReactProps({nonce});
  });

  describe('<ImportRemote />', () => {
    it('renders', () => {
      const universal = mount(<Universal {...mockProps} />);
      expect(universal).toContainReactComponent(ImportRemote);
    });

    it('loads the universal Google Analytics script', () => {
      const universal = mount(<Universal {...mockProps} />);
      expect(universal.find(ImportRemote)).toHaveReactProps({
        source: UNIVERSAL_GA_SCRIPT,
      });
    });

    it('requests preconnect', () => {
      const universal = mount(<Universal {...mockProps} />);
      expect(universal.find(ImportRemote)).toHaveReactProps({preconnect: true});
    });

    it('extracts the global from window', () => {
      const analytics = mockAnalytics();
      const fakeWindow: Window = {ga: analytics} as any;
      const universal = mount(<Universal {...mockProps} />);
      const result = universal
        .find(ImportRemote)!
        .trigger('getImport', fakeWindow);

      expect(result).toBe(analytics);
    });
  });

  describe('account', () => {
    const account = 'abc1234';

    it('pushes the create action', () => {
      const analytics = mockAnalytics();
      const universal = mount(<Universal {...mockProps} account={account} />);
      universal.find(ImportRemote)!.trigger('onImported', analytics);
      expect(analytics).toHaveBeenCalledWith(
        'create',
        account,
        'auto',
        expect.anything(),
      );
    });
  });

  describe('domain', () => {
    const domain = 'abc.com';

    it('sets the domain and linker options in the create action', () => {
      const analytics = mockAnalytics();
      const universal = mount(<Universal {...mockProps} domain={domain} />);
      universal.find(ImportRemote)!.trigger('onImported', analytics);
      expect(analytics.mock.calls[0][3]).toMatchObject({
        cookieDomain: domain,
        legacyCookieDomain: domain,
        allowLinker: true,
      });
    });

    it('uses the normalized domain when it has subdomains', () => {
      const domainWithSubs = 'a.b.com';
      const normalizedDomain = '.b.com';
      const analytics = mockAnalytics();
      const universal = mount(
        <Universal {...mockProps} domain={domainWithSubs} />,
      );
      universal.find(ImportRemote)!.trigger('onImported', analytics);

      expect(analytics.mock.calls[0][3]).toMatchObject({
        cookieDomain: normalizedDomain,
        legacyCookieDomain: normalizedDomain,
        allowLinker: true,
      });
    });
  });

  describe('set', () => {
    it('sets no custom variables when none are provided', () => {
      const analytics = mockAnalytics();
      const universal = mount(<Universal {...mockProps} />);
      universal.find(ImportRemote)!.trigger('onImported', analytics);
      expect(analytics).not.toHaveBeenCalledWith([
        'set',
        expect.anything(),
        expect.anything(),
      ]);
    });

    it('performs the set action for each key-value pair', () => {
      const customVariables = {foo: true, bar: 'false'};
      const analytics = mockAnalytics();
      const universal = mount(
        <Universal {...mockProps} set={customVariables} />,
      );
      universal.find(ImportRemote)!.trigger('onImported', analytics);

      for (const [key, value] of Object.entries(customVariables)) {
        expect(analytics).toHaveBeenCalledWith('set', key, value);
      }
    });
  });

  describe('onLoad()', () => {
    it('is called with the resolved analytics', () => {
      const onLoad = jest.fn();
      const analytics = mockAnalytics();
      const universal = mount(<Universal {...mockProps} onLoad={onLoad} />);
      universal.find(ImportRemote)!.trigger('onImported', analytics);
      expect(onLoad).toHaveBeenCalledWith(analytics);
    });
  });

  describe('onError()', () => {
    it('is called with the error object', () => {
      const onError = jest.fn();
      const error = new Error('Script download error');
      const universal = mount(<Universal {...mockProps} onError={onError} />);

      universal.find(ImportRemote)!.trigger('onImported', error);

      expect(onError).toHaveBeenCalledWith(error);
    });
  });

  describe('debug', () => {
    it('loads the GA script without restrictions when debug is not set', () => {
      const analytics = mockAnalytics();
      const universal = mount(<Universal {...mockProps} />);

      expect(universal.find(ImportRemote)).toHaveReactProps({
        source: UNIVERSAL_GA_SCRIPT,
      });

      universal.find(ImportRemote)!.trigger('onImported', analytics);

      expect(analytics).not.toHaveBeenCalledWith('set', 'sendHitTask', null);
    });

    it('loads the GA debug script and prevent sending data to GA when debug is set to true', () => {
      const analytics = mockAnalytics();
      const domain = 'myshopify.com';
      const account = 'tobi';
      const universal = mount(
        <Universal {...mockProps} debug domain={domain} account={account} />,
      );

      expect(universal.find(ImportRemote)).toHaveReactProps({
        source: UNIVERSAL_GA_DEBUG_SCRIPT,
      });

      universal.find(ImportRemote)!.trigger('onImported', analytics);

      expect(analytics).toHaveBeenNthCalledWith(1, 'create', account, 'auto', {
        allowLinker: true,
        cookieDomain: domain,
        legacyCookieDomain: domain,
      });
      expect(analytics).toHaveBeenNthCalledWith(2, 'set', 'sendHitTask', null);
    });

    it('loads the GA script and does not prevent sending data to GA when debug is set to false', () => {
      const analytics = mockAnalytics();
      const universal = mount(<Universal {...mockProps} debug={false} />);

      expect(universal.find(ImportRemote)).toHaveReactProps({
        source: UNIVERSAL_GA_SCRIPT,
      });

      universal.find(ImportRemote)!.trigger('onImported', analytics);
      expect(analytics).not.toHaveBeenCalledWith('set', 'sendHitTask', null);
    });
  });

  describe('disableTracking', () => {
    it('loads the GA script and prevent sending data to GA when disableTracking is set to true', () => {
      const analytics = mockAnalytics();
      const universal = mount(<Universal {...mockProps} disableTracking />);

      expect(universal.find(ImportRemote)).toHaveReactProps({
        source: UNIVERSAL_GA_SCRIPT,
      });

      universal.find(ImportRemote)!.trigger('onImported', analytics);

      expect(analytics).toHaveBeenNthCalledWith(
        1,
        'create',
        mockProps.account,
        'auto',
        {
          allowLinker: true,
          cookieDomain: 'myshopify.com',
          legacyCookieDomain: 'myshopify.com',
        },
      );
      expect(analytics).toHaveBeenNthCalledWith(2, 'set', 'sendHitTask', null);
    });

    it('loads the GA script and does not prevent sending data to GA when disableTracking is set to false', () => {
      const analytics = mockAnalytics();
      const universal = mount(
        <Universal {...mockProps} disableTracking={false} />,
      );

      expect(universal.find(ImportRemote)).toHaveReactProps({
        source: UNIVERSAL_GA_SCRIPT,
      });

      universal.find(ImportRemote)!.trigger('onImported', analytics);
      expect(analytics).not.toHaveBeenCalledWith('set', 'sendHitTask', null);
    });
  });
});

function mockAnalytics() {
  return jest.fn();
}
