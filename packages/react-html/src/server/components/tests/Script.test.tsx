import React from 'react';
import {mount} from '@shopify/react-testing';

import {Script} from '../Script';

describe('<Script />', () => {
  it('renders attributes', () => {
    const script = mount(
      <Script
        src="foo.js"
        integrity="00000000"
        crossOrigin="anonymous"
        defer
      />,
    );

    expect(script).toContainReactComponent('script', {
      src: 'foo.js',
      integrity: '00000000',
      crossOrigin: 'anonymous',
      defer: true,
    });
  });

  describe('type', () => {
    it('defaults to text/javascript', () => {
      const script = mount(<Script src="foo.js" />);

      expect(script).toContainReactComponent('script', {
        type: 'text/javascript',
      });
      expect(script).not.toContainReactComponent('script', {
        nomodule: expect.anything(),
      });
    });

    it('renders noModule when specified', () => {
      const script = mount(<Script src="foo.js" type="nomodule" />);
      expect(script).toContainReactComponent('script', {
        type: 'text/javascript',
        noModule: true,
      });
    });

    it('renders module when specified', () => {
      const script = mount(<Script src="foo.js" type="module" />);
      expect(script).toContainReactComponent('script', {
        type: 'module',
      });
      expect(script).not.toContainReactComponent('script', {
        noModule: expect.anything(),
      });
    });

    it('omits defer attribute for modules', () => {
      const script = mount(<Script src="foo.js" type="module" defer />);
      expect(script).not.toContainReactComponent('script', {
        defer: expect.anything(),
      });
    });

    it('renders arbitrary types', () => {
      const script = mount(<Script src="foo.js" type="bar" />);
      expect(script).toContainReactComponent('script', {
        type: 'bar',
      });
    });
  });
});
