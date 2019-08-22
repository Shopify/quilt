import * as React from 'react';
import {mount} from '@shopify/react-testing';
import ImportRemote from '@shopify/react-import-remote';

import GaJS, {
  Props,
  SETUP_SCRIPT,
  setupWithDebugScript,
  GA_JS_SCRIPT,
} from '../GaJS';

jest.mock('@shopify/react-import-remote', () => () => null);

describe('<GaJS />', () => {
  const mockProps: Props = {
    account: 'abc',
    domain: 'myshopify.com',
    devId: '123',
  };

  describe('setup script', () => {
    it('renders a script tag with the setup content', () => {
      const gajs = mount(<GaJS {...mockProps} />);
      expect(gajs).toContainReactComponent('script', {
        dangerouslySetInnerHTML: {__html: SETUP_SCRIPT},
      });
    });
  });

  it('passes nonce prop to script tag', () => {
    const nonce = '123';
    const universal = mount(<GaJS {...mockProps} nonce={nonce} />);
    expect(universal).toContainReactComponent('script', {nonce});
  });

  it('passes nonce prop to <ImportRemote />', () => {
    const nonce = '123';
    const gajs = mount(<GaJS {...mockProps} nonce={nonce} />);
    expect(gajs).toContainReactComponent(ImportRemote, {nonce});
  });

  describe('<ImportRemote />', () => {
    it('renders', () => {
      const gajs = mount(<GaJS {...mockProps} />);
      expect(gajs).toContainReactComponent(ImportRemote);
    });

    it('loads the gajs Google Analytics script', () => {
      const gajs = mount(<GaJS {...mockProps} />);
      expect(gajs).toContainReactComponent(ImportRemote, {
        source: GA_JS_SCRIPT,
      });
    });

    it('requests preconnect', () => {
      const gajs = mount(<GaJS {...mockProps} />);
      expect(gajs).toContainReactComponent(ImportRemote, {preconnect: true});
    });

    it('extracts the global from window', () => {
      const analytics = mockAnalytics();
      const fakeWindow: Window = {_gaq: analytics} as any;
      const gajs = mount(<GaJS {...mockProps} />);
      const result = gajs.find(ImportRemote)!.trigger('getImport', fakeWindow);

      expect(result).toBe(analytics);
    });
  });

  describe('set', () => {
    describe('account', () => {
      const account = 'abc1234';

      it('pushes the _setAccount action', () => {
        const analytics = mockAnalytics();
        const gajs = mount(<GaJS {...mockProps} account={account} />);
        gajs.find(ImportRemote)!.trigger('onImported', analytics);
        expect(analytics.push).toHaveBeenCalledWith(['_setAccount', account]);
      });
    });

    describe('domain', () => {
      const domain = 'abc.com';

      it('pushes the _setDomainName action', () => {
        const analytics = mockAnalytics();
        const gajs = mount(<GaJS {...mockProps} domain={domain} />);
        gajs.find(ImportRemote)!.trigger('onImported', analytics);
        expect(analytics.push).toHaveBeenCalledWith(['_setDomainName', domain]);
      });

      it('uses the domain name with subdomains stripped', () => {
        const domainWithSubs = 'a.b.com';
        const analytics = mockAnalytics();
        const gajs = mount(<GaJS {...mockProps} domain={domainWithSubs} />);
        gajs.find(ImportRemote)!.trigger('onImported', analytics);
        expect(analytics.push).toHaveBeenCalledWith([
          '_setDomainName',
          '.b.com',
        ]);
      });
    });

    describe('devId', () => {
      const devId = 'abc1234';

      it('does not set _addDevId by default', () => {
        const analytics = mockAnalytics();
        const gajs = mount(<GaJS {...mockProps} />);
        gajs.find(ImportRemote)!.trigger('onImported', analytics);
        expect(analytics.push).not.toHaveBeenCalledWith(['_addDevId', devId]);
      });

      it('pushes the _addDevId action', () => {
        const analytics = mockAnalytics();
        const gajs = mount(<GaJS {...mockProps} devId={devId} />);
        gajs.find(ImportRemote)!.trigger('onImported', analytics);
        expect(analytics.push).toHaveBeenCalledWith(['_addDevId', devId]);
      });

      it('does not push the _addDevId action when the an empty string is passed', () => {
        const analytics = mockAnalytics();
        const gajs = mount(<GaJS {...mockProps} devId="" />);
        gajs.find(ImportRemote)!.trigger('onImported', analytics);
        expect(analytics.push).not.toHaveBeenCalledWith(['_addDevId', '']);
      });
    });

    describe('_setAllowLinker', () => {
      it('does not set _setAllowLinker by default', () => {
        const analytics = mockAnalytics();
        const gajs = mount(<GaJS {...mockProps} />);
        gajs.find(ImportRemote)!.trigger('onImported', analytics);
        expect(analytics.push).not.toHaveBeenCalledWith([
          '_setAllowLinker',
          expect.anything(),
        ]);
      });

      it('pushes true the _setAllowLinker action', () => {
        const analytics = mockAnalytics();
        const gajs = mount(<GaJS {...mockProps} allowLinker />);
        gajs.find(ImportRemote)!.trigger('onImported', analytics);
        expect(analytics.push).toHaveBeenCalledWith(['_setAllowLinker', true]);
      });

      it('pushes false the _setAllowLinker action', () => {
        const analytics = mockAnalytics();
        const gajs = mount(<GaJS {...mockProps} allowLinker={false} />);
        gajs.find(ImportRemote)!.trigger('onImported', analytics);
        expect(analytics.push).toHaveBeenCalledWith(['_setAllowLinker', false]);
      });
    });

    describe('_setAllowHash', () => {
      it('does not set _setAllowHash by default', () => {
        const analytics = mockAnalytics();
        const gajs = mount(<GaJS {...mockProps} />);
        gajs.find(ImportRemote)!.trigger('onImported', analytics);
        expect(analytics.push).not.toHaveBeenCalledWith([
          '_setAllowHash',
          expect.anything(),
        ]);
      });

      it('pushes true the _setAllowHash action', () => {
        const analytics = mockAnalytics();
        const gajs = mount(<GaJS {...mockProps} allowHash />);
        gajs.find(ImportRemote)!.trigger('onImported', analytics);
        expect(analytics.push).toHaveBeenCalledWith(['_setAllowHash', true]);
      });

      it('pushes false the _setAllowHash action', () => {
        const analytics = mockAnalytics();
        const gajs = mount(<GaJS {...mockProps} allowHash={false} />);
        gajs.find(ImportRemote)!.trigger('onImported', analytics);
        expect(analytics.push).toHaveBeenCalledWith(['_setAllowHash', false]);
      });
    });

    describe('custom variables', () => {
      it('sets no custom variables when none are provided', () => {
        const analytics = mockAnalytics();
        const gajs = mount(<GaJS {...mockProps} />);
        gajs.find(ImportRemote)!.trigger('onImported', analytics);
        expect(analytics.push).not.toHaveBeenCalledWith([
          '_setCustomVar',
          expect.anything(),
        ]);
      });

      it('pushes the _setCustomVar action', () => {
        const customVariables = [[1], [2, 3]];
        const analytics = mockAnalytics();
        const gajs = mount(<GaJS {...mockProps} set={customVariables} />);
        gajs.find(ImportRemote)!.trigger('onImported', analytics);

        for (const customVariable of customVariables) {
          expect(analytics.push).toHaveBeenCalledWith([
            '_setCustomVar',
            ...customVariable,
          ]);
        }
      });
    });
  });

  describe('disableTracking', () => {
    it('loads the GA script and injects the setup script when disableTracking is not set', () => {
      const gajs = mount(<GaJS {...mockProps} />);
      expect(gajs.find(ImportRemote)).toHaveReactProps({source: GA_JS_SCRIPT});
      expect(gajs.find('script')).toHaveReactProps({
        dangerouslySetInnerHTML: {__html: SETUP_SCRIPT},
      });
    });

    it('loads the GA script and injects the debug setup script when disableTracking is set to true', () => {
      const gajs = mount(<GaJS {...mockProps} disableTracking />);
      expect(gajs.find(ImportRemote)).toHaveReactProps({source: GA_JS_SCRIPT});
      expect(gajs.find('script')).toHaveReactProps({
        dangerouslySetInnerHTML: {
          __html: setupWithDebugScript(mockProps.account),
        },
      });
    });

    it('loads the GA script and injects the setup script when disableTracking is set to false', () => {
      const gajs = mount(<GaJS {...mockProps} disableTracking={false} />);
      expect(gajs.find(ImportRemote)).toHaveReactProps({source: GA_JS_SCRIPT});
      expect(gajs.find('script')).toHaveReactProps({
        dangerouslySetInnerHTML: {__html: SETUP_SCRIPT},
      });
    });
  });

  describe('onLoad()', () => {
    it('is called with the resolved analytics', () => {
      const onLoad = jest.fn();
      const analytics = mockAnalytics();
      const gajs = mount(<GaJS {...mockProps} onLoad={onLoad} />);
      gajs.find(ImportRemote)!.trigger('onImported', analytics);
      expect(onLoad).toHaveBeenCalledWith(analytics);
    });
  });
});

function mockAnalytics() {
  return {push: jest.fn()};
}
