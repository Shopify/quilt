/* eslint react/jsx-pascal-case: off */

import * as React from 'react';
import {mount, CommonWrapper} from 'enzyme';
import {HelmetData} from 'react-helmet';
import {Serializer} from '@shopify/react-serialize';

import {Script, Style} from '../components';
import HTML, {Props} from '../HTML';

jest.mock('react-helmet', () => {
  return {
    renderStatic: jest.fn(),
  };
});

const helmetMock = require.requireMock('react-helmet');

describe('<HTML />', () => {
  beforeEach(() => {
    helmetMock.renderStatic.mockReset();
    helmetMock.renderStatic.mockImplementation(mockHelmet);
  });

  const mockProps: Props = {};

  it('defaults to setting the lang to "en" on the html', () => {
    const html = mount(<HTML {...mockProps} />);
    expect(html.find('html').prop('lang')).toBe('en');
  });

  describe('hideForInitialLoad', () => {
    it('does not hide the contents by default', () => {
      const app = mount(<HTML {...mockProps} />);
      const styles = app.find('#app').prop('style') || {};
      expect(styles).not.toHaveProperty('display');
    });

    it('hides the contents when true', () => {
      const app = mount(<HTML {...mockProps} hideForInitialLoad />);
      expect(app.find('body').prop('style')).toMatchObject({
        display: 'none',
      });
    });
  });

  describe('children', () => {
    it('is used as the content of the app host node', () => {
      const html = mount(<HTML {...mockProps}>hello world</HTML>);
      expect(
        html
          .find('div')
          .find({id: 'app'})
          .prop('dangerouslySetInnerHTML'),
      ).toHaveProperty('__html', 'hello world');
    });
  });

  describe('deferedScripts', () => {
    it('generates a script tag in the body with the `defer` attribute', () => {
      const scripts = [{path: 'foo.js'}, {path: 'bar.js'}];
      const html = mount(<HTML {...mockProps} scripts={scripts} />);
      const body = html.find('body');

      for (const script of scripts) {
        expect(
          body.findWhere(
            element =>
              element.is(Script) && element.prop('src') === script.path,
          ),
        ).toHaveLength(1);
      }
    });
  });

  describe('blockingScripts', () => {
    it('generates a script tag in the head without the `defer` attribute', () => {
      const scripts = [{path: 'foo.js'}, {path: 'bar.js'}];
      const html = mount(<HTML {...mockProps} blockingScripts={scripts} />);
      const head = html.find('head');

      for (const script of scripts) {
        expect(
          head.findWhere(
            element =>
              element.is(Script) && element.prop('src') === script.path,
          ),
        ).toHaveLength(1);
      }
    });
  });

  describe('styles', () => {
    it('generates a link tag in the head', () => {
      const styles = [{path: 'foo.js'}, {path: 'bar.js'}];
      const html = mount(<HTML {...mockProps} styles={styles} />);
      const head = html.find('head');

      for (const style of styles) {
        expect(
          head.findWhere(
            element => element.is(Style) && element.prop('href') === style.path,
          ),
        ).toHaveLength(1);
      }
    });
  });

  describe('helmet', () => {
    it('includes the title component', () => {
      const title = <title>Hello world!</title>;
      helmetMock.renderStatic.mockImplementation(() =>
        mockHelmet({
          title: mockHelmetData('', title),
        }),
      );
      const html = mount(<HTML {...mockProps} />);
      expect(html.find('head').contains(title)).toBe(true);
    });

    it('includes the meta component', () => {
      const meta = <meta content="Hello world" />;
      helmetMock.renderStatic.mockImplementation(() =>
        mockHelmet({
          meta: mockHelmetData('', meta),
        }),
      );
      const html = mount(<HTML {...mockProps} />);
      expect(html.find('head').contains(meta)).toBe(true);
    });

    it('includes the link component', () => {
      const link = <link rel="hello/world" />;
      helmetMock.renderStatic.mockImplementation(() =>
        mockHelmet({
          link: mockHelmetData('', link),
        }),
      );
      const html = mount(<HTML {...mockProps} />);
      expect(html.find('head').contains(link)).toBe(true);
    });

    it('includes the script component', () => {
      const script = (
        <script dangerouslySetInnerHTML={{__html: 'alert("hi")'}} />
      );
      helmetMock.renderStatic.mockImplementation(() =>
        mockHelmet({
          script: mockHelmetData('', script),
        }),
      );
      const html = mount(<HTML {...mockProps} />);
      expect(html.find('head').contains(script)).toBe(true);
    });

    it('includes the htmlAttributes', () => {
      const htmlAttributes = {className: 'hello world', 'data-baz': true};
      helmetMock.renderStatic.mockImplementation(() =>
        mockHelmet({
          htmlAttributes: mockHelmetData('', htmlAttributes),
        }),
      );
      const html = mount(<HTML {...mockProps} />);
      expect(html.find('html').props()).toMatchObject(htmlAttributes);
    });

    it('includes the bodyAttributes', () => {
      const bodyAttributes = {className: 'hello world', 'data-baz': true};
      helmetMock.renderStatic.mockImplementation(() =>
        mockHelmet({
          bodyAttributes: mockHelmetData('', bodyAttributes),
        }),
      );
      const html = mount(<HTML {...mockProps} />);
      expect(html.find('body').props()).toMatchObject(bodyAttributes);
    });
  });

  describe('headData', () => {
    it('does not render a serializer when no details are provided', () => {
      const html = mount(<HTML {...mockProps} />);
      expect(html.find(Serializer)).toHaveLength(0);
    });

    it('renders a serializer for each key', () => {
      const data = {
        requestDetails: {foo: 'bar'},
        foo: {bar: 'baz'},
      };

      const html = mount(<HTML {...mockProps} headData={data} />);

      Object.keys(data).forEach(id => {
        const serializer = html.find(Serializer).filter({id});
        expect(serializer.prop('data')).toMatchObject(data[id]);
      });
    });

    it('renders the serializers in the head before the sync scripts', () => {
      const headData = {foo: true};
      const html = mount(
        <HTML
          {...mockProps}
          headData={headData}
          blockingScripts={[{path: 'foo.js'}]}
        />,
      );
      const headContents = html.find('head').children();

      const serializerIndex = findIndex(
        headContents,
        element => element.is(Serializer) && element.is({id: 'foo'}),
      );

      const scriptsIndex = findIndex(headContents, element =>
        element.is(Script),
      );

      expect(serializerIndex).toBeLessThan(scriptsIndex);
    });
  });

  describe('data', () => {
    it('does not render a serializer when no details are provided', () => {
      const html = mount(<HTML {...mockProps} />);
      expect(html.find(Serializer)).toHaveLength(0);
    });

    it('renders a serializer for each key', () => {
      const data = {
        bar: {
          first: 1,
          second: 2,
        },
        foo: {
          bar: 'baz',
        },
      };
      const html = mount(<HTML {...mockProps} data={data} />);

      Object.keys(data).forEach(id => {
        const serializer = html.find(Serializer).filter({id});
        expect(serializer.prop('data')).toMatchObject(data[id]);
      });
    });

    it('renders the serializers in the body before the defered scripts', () => {
      const data = {foo: {bar: 'baz'}};
      const html = mount(
        <HTML {...mockProps} data={data} scripts={[{path: 'foo.js'}]} />,
      );
      const bodyContents = html.find('body').children();
      const serializerIndex = findIndex(
        bodyContents,
        element => element.is(Serializer) && element.is({id: 'foo'}),
      );

      const scriptsIndex = findIndex(bodyContents, element =>
        element.is(Script),
      );

      expect(serializerIndex).toBeLessThan(scriptsIndex);
    });
  });
});

function findIndex(
  wrapper: CommonWrapper,
  predicate: (element: CommonWrapper) => boolean,
) {
  let found = -1;

  wrapper.forEach((element, index) => {
    if (found < 0 && predicate(element)) {
      found = index;
    }
  });

  if (found === -1) {
    throw new Error(`findIndex matched 0 elements`);
  }
  return found;
}

function mockHelmet(mock: Partial<HelmetData> = {}): HelmetData {
  return {
    base: mockHelmetData('', <div />),
    bodyAttributes: mockHelmetData('', {}),
    htmlAttributes: mockHelmetData('', {}),
    link: mockHelmetData('', <link />),
    meta: mockHelmetData('', <meta />),
    noscript: mockHelmetData('', <noscript />),
    script: mockHelmetData('', <script />),
    style: mockHelmetData('', <link />),
    title: mockHelmetData('', <title />),
    titleAttributes: mockHelmetData('', <script />),
    ...mock,
  };
}

function mockHelmetData<T>(str: string, component: T) {
  return {
    toString() {
      return str;
    },
    toComponent() {
      return component as any;
    },
  };
}
