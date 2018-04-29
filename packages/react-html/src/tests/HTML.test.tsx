/* eslint react/jsx-pascal-case: off */

import * as React from 'react';
import {mount, CommonWrapper} from 'enzyme';
import {HelmetData} from 'react-helmet';
import {Serializer} from '@shopify/react-serialize';
import withEnv from '@shopify/with-env';

import {Script, Style} from '../components';
import HTML, {Props} from '../HTML';

describe('<HTML />', () => {
  const mockProps: Props = {
    markup: '',
    helmet: mockHelmet(),
  };

  it('defaults to setting the lang to "en" on the html', () => {
    const html = mount(<HTML {...mockProps} />);
    expect(html.find('html').prop('lang')).toBe('en');
  });

  it('is not styled `display: none` on host node in production', () => {
    const app = withEnv('production', () => mount(<HTML {...mockProps} />));
    const styles = app.find('#app').prop('style');
    expect(styles && styles.display).not.toBe('none');
  });

  it('is not styled `display: none` on the host node when there are no deferred scripts', () => {
    const app = withEnv('development', () => mount(<HTML {...mockProps} />));
    const styles = app.find('#app').prop('style');
    expect(styles && styles.display).not.toBe('none');
  });

  it('sets the display to none on the document body in development when there are deferred scripts to prevent the flash of unstyled content', () => {
    const app = withEnv('development', () =>
      mount(<HTML {...mockProps} deferedScripts={[{path: 'foo.js'}]} />),
    );
    expect(app.find('body').prop('style')).toMatchObject({
      display: 'none',
    });
  });

  describe('markup', () => {
    it('is used as the content of the app host node', () => {
      const html = mount(<HTML {...mockProps} markup="hello world" />);
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
      const html = mount(<HTML {...mockProps} deferedScripts={scripts} />);
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

  describe('synchronousScripts', () => {
    it('generates a script tag in the head without the `defer` attribute', () => {
      const scripts = [{path: 'foo.js'}, {path: 'bar.js'}];
      const html = mount(<HTML {...mockProps} synchronousScripts={scripts} />);
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
      const helmet = mockHelmet({
        title: mockHelmetData('', title),
      });
      const html = mount(<HTML {...mockProps} helmet={helmet} />);
      expect(html.find('head').contains(title)).toBe(true);
    });

    it('includes the meta component', () => {
      const meta = <meta content="Hello world" />;
      const helmet = mockHelmet({
        meta: mockHelmetData('', meta),
      });
      const html = mount(<HTML {...mockProps} helmet={helmet} />);
      expect(html.find('head').contains(meta)).toBe(true);
    });

    it('includes the link component', () => {
      const link = <link rel="hello/world" />;
      const helmet = mockHelmet({
        link: mockHelmetData('', link),
      });
      const html = mount(<HTML {...mockProps} helmet={helmet} />);
      expect(html.find('head').contains(link)).toBe(true);
    });

    it('includes the htmlAttributes', () => {
      const htmlAttributes = {className: 'hello world', 'data-baz': true};
      const helmet = mockHelmet({
        htmlAttributes: mockHelmetData('', htmlAttributes),
      });
      const html = mount(<HTML {...mockProps} helmet={helmet} />);
      expect(html.find('html').props()).toMatchObject(htmlAttributes);
    });

    it('includes the bodyAttributes', () => {
      const bodyAttributes = {className: 'hello world', 'data-baz': true};
      const helmet = mockHelmet({
        bodyAttributes: mockHelmetData('', bodyAttributes),
      });
      const html = mount(<HTML {...mockProps} helmet={helmet} />);
      expect(html.find('body').props()).toMatchObject(bodyAttributes);
    });
  });

  describe('requestDetails', () => {
    const id = 'request-details';

    it('does not have a serializer when no details are provided', () => {
      const html = mount(<HTML {...mockProps} />);
      expect(html.find(Serializer).filter({id})).toHaveLength(0);
    });

    it('is included in a serializer', () => {
      const requestDetails = {foo: true};
      const html = mount(
        <HTML {...mockProps} requestDetails={requestDetails} />,
      );
      const serializer = html.find(Serializer).filter({id});
      expect(serializer.prop('data')).toMatchObject(requestDetails);
    });

    it('places the request-details serializer before the sync scripts', () => {
      const requestDetails = {foo: true};
      const html = mount(
        <HTML
          {...mockProps}
          requestDetails={requestDetails}
          synchronousScripts={[{path: 'foo.js'}]}
        />,
      );
      const headContents = html.find('head').children();

      const serializerIndex = findIndex(
        headContents,
        element => element.is(Serializer) && element.is({id}),
      );

      const scriptsIndex = findIndex(headContents, element =>
        element.is(Script),
      );

      expect(serializerIndex).toBeLessThan(scriptsIndex);
    });
  });

  describe('initialApolloData', () => {
    const id = 'initial-apollo-data';

    it('does not have a serializer when no data are provided', () => {
      const html = mount(<HTML {...mockProps} />);
      expect(html.find(Serializer).filter({id})).toHaveLength(0);
    });

    it('is included in a serializer', () => {
      const initialApolloData = {foo: true};
      const html = mount(
        <HTML {...mockProps} initialApolloData={initialApolloData} />,
      );
      const serializer = html.find(Serializer).filter({id});
      expect(serializer.prop('data')).toMatchObject(initialApolloData);
    });

    it('places the intial-apollo-data serializer before the defered scripts', () => {
      const initialApolloData = {foo: true};
      const html = mount(
        <HTML
          {...mockProps}
          initialApolloData={initialApolloData}
          deferedScripts={[{path: 'foo.js'}]}
        />,
      );
      const bodyContents = html.find('body').children();
      const serializerIndex = findIndex(
        bodyContents,
        element => element.is(Serializer) && element.is({id}),
      );

      const scriptsIndex = findIndex(bodyContents, element =>
        element.is(Script),
      );

      expect(serializerIndex).toBeLessThan(scriptsIndex);
    });
  });

  describe('initialReduxState', () => {
    const id = 'initial-redux-state';

    it('does not have a serializer when no data are provided', () => {
      const html = mount(<HTML {...mockProps} />);
      expect(html.find(Serializer).filter({id})).toHaveLength(0);
    });

    it('is included in a serializer', () => {
      const initialReduxState = {foo: true};
      const html = mount(
        <HTML {...mockProps} initialReduxState={initialReduxState} />,
      );
      const serializer = html.find(Serializer).filter({id});
      expect(serializer.prop('data')).toMatchObject(initialReduxState);
    });

    it('places the initial-redux-state serializer before the defered scripts', () => {
      const initialReduxState = {foo: true};
      const html = mount(
        <HTML
          {...mockProps}
          initialReduxState={initialReduxState}
          deferedScripts={[{path: 'foo.js'}]}
        />,
      );
      const bodyContents = html.find('body').children();

      const serializerIndex = findIndex(
        bodyContents,
        element => element.is(Serializer) && element.is({id}),
      );

      const scriptsIndex = findIndex(bodyContents, element =>
        element.is(Script),
      );

      expect(serializerIndex).toBeLessThan(scriptsIndex);
    });
  });

  describe('browser', () => {
    const id = 'browser';

    it('does not have a serializer when no details are provided', () => {
      const html = mount(<HTML {...mockProps} />);
      expect(html.find(Serializer).filter({id})).toHaveLength(0);
    });

    it('is included in a serializer', () => {
      const browser = {userAgent: 'something really old', supported: false};
      const html = mount(<HTML {...mockProps} browser={browser} />);
      const serializer = html.find(Serializer).filter({id});
      expect(serializer.prop('data')).toMatchObject(browser);
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
