import * as React from 'react';
import {mount} from 'enzyme';
import ImportRemote from '@shopify/react-import-remote';
import {trigger} from '@shopify/enzyme-utilities';

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
      expect(
        universal.find('script').prop('dangerouslySetInnerHTML'),
      ).toHaveProperty('__html', SETUP_SCRIPT);
    });
  });

  describe('<ImportRemote />', () => {
    it('renders', () => {
      const universal = mount(<Universal {...mockProps} />);
      expect(universal.find(ImportRemote)).toHaveLength(1);
    });

    it('loads the universal Google Analytics script', () => {
      const universal = mount(<Universal {...mockProps} />);
      expect(universal.find(ImportRemote).prop('source')).toBe(
        UNIVERSAL_GA_SCRIPT,
      );
    });

    it('requests preload', () => {
      const universal = mount(<Universal {...mockProps} />);
      expect(universal.find(ImportRemote).prop('preconnect')).toBe(true);
    });

    it('extracts the global from window', () => {
      const analytics = mockAnalytics();
      const fakeWindow = {ga: analytics};
      const universal = mount(<Universal {...mockProps} />);
      expect(
        trigger(universal.find(ImportRemote), 'getImport', fakeWindow),
      ).toBe(analytics);
    });
  });

  describe('account', () => {
    const account = 'abc1234';

    it('pushes the create action', () => {
      const analytics = mockAnalytics();
      const universal = mount(<Universal {...mockProps} account={account} />);
      trigger(universal.find(ImportRemote), 'onImported', analytics);
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
      trigger(universal.find(ImportRemote), 'onImported', analytics);
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
      trigger(universal.find(ImportRemote), 'onImported', analytics);

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
      trigger(universal.find(ImportRemote), 'onImported', analytics);
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
      trigger(universal.find(ImportRemote), 'onImported', analytics);

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
      trigger(universal.find(ImportRemote), 'onImported', analytics);
      expect(onLoad).toHaveBeenCalledWith(analytics);
    });
  });

  describe('debug', () => {
    it('loads the GA script without restrictions when debug is not set', () => {
      const analytics = mockAnalytics();
      const universal = mount(<Universal {...mockProps} />);
      expect(universal.find(ImportRemote).prop('source')).toBe(
        UNIVERSAL_GA_SCRIPT,
      );
      trigger(universal.find(ImportRemote), 'onImported', analytics);
      expect(analytics).not.toHaveBeenCalledWith('set', 'sendHitTask', null);
    });

    it('loads the GA debug script and prevent sending data to GA when debug is set to true', () => {
      const analytics = mockAnalytics();
      const universal = mount(<Universal {...mockProps} debug />);
      expect(universal.find(ImportRemote).prop('source')).toBe(
        UNIVERSAL_GA_DEBUG_SCRIPT,
      );
      trigger(universal.find(ImportRemote), 'onImported', analytics);
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

    it('loads the GA script and does not prevent sending data to GA when debug is set to false', () => {
      const analytics = mockAnalytics();
      const universal = mount(<Universal {...mockProps} debug={false} />);
      expect(universal.find(ImportRemote).prop('source')).toBe(
        UNIVERSAL_GA_SCRIPT,
      );
      trigger(universal.find(ImportRemote), 'onImported', analytics);
      expect(analytics).not.toHaveBeenCalledWith('set', 'sendHitTask', null);
    });
  });

  describe('disableTracking', () => {
    it('loads the GA script and prevent sending data to GA when disableTracking is set to true', () => {
      const analytics = mockAnalytics();
      const universal = mount(<Universal {...mockProps} disableTracking />);
      expect(universal.find(ImportRemote).prop('source')).toBe(
        UNIVERSAL_GA_SCRIPT,
      );
      trigger(universal.find(ImportRemote), 'onImported', analytics);
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
      expect(universal.find(ImportRemote).prop('source')).toBe(
        UNIVERSAL_GA_SCRIPT,
      );
      trigger(universal.find(ImportRemote), 'onImported', analytics);
      expect(analytics).not.toHaveBeenCalledWith('set', 'sendHitTask', null);
    });
  });
});

function mockAnalytics() {
  return jest.fn();
}
