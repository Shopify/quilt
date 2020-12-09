import * as React from 'react';
import {Link as ReactRouterLink} from 'react-router-dom';
import {mount} from '@shopify/react-testing';

import Link from '../Link';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  Link: function Link() {
    return null;
  },
}));

describe('<Link />', () => {
  describe('url', () => {
    it('renders a react router link', () => {
      const link = mount(<Link url="/home" />);
      expect(link).toContainReactComponent(ReactRouterLink);
    });

    it('sets the `to` prop and passes along the other props to ReactRouterLink', () => {
      const url = '/home';
      const props = {className: 'foo'};
      const link = mount(<Link url={url} {...props} />);
      expect(link).toContainReactComponent(ReactRouterLink, {
        ...props,
        to: url,
      });
    });

    it('does not set external attributes', () => {
      const link = mount(<Link url="/home" />);
      expect(link.find(ReactRouterLink)!.prop('target')).toBeUndefined();
      expect(link.find(ReactRouterLink)!.prop('rel')).toBeUndefined();
    });
  });

  describe('external', () => {
    it('renders a react router link', () => {
      const link = mount(<Link url="https://shopify.com" />);
      expect(link).toContainReactComponent(ReactRouterLink);
    });

    it('sets the `to` prop and passes along other props to ReactRouterLink', () => {
      const url = '/home';
      const link = mount(<Link url={url} className="foo" />);
      expect(link).toContainReactComponent(ReactRouterLink, {
        className: 'foo',
        to: url,
      });
    });

    it('sets default external attributes', () => {
      const link = mount(<Link url="https://shopify.com" external />);
      expect(link).toContainReactComponent(ReactRouterLink, {
        target: '_blank',
        rel: 'noopener noreferrer',
      });
    });
  });
});
