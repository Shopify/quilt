import * as React from 'react';
import {mount, CommonWrapper} from 'enzyme';
import {HelmetData} from 'react-helmet';
import withEnv from '@shopify/with-env';

import {Script, Style} from '../../../components';
import Manager from '../../../manager';
import {MANAGED_ATTRIBUTE} from '../../../utilities';

import Html from '../Html';
import Serialize from '../Serialize';

jest.mock('react-helmet', () => {
  return {
    renderStatic: jest.fn(),
  };
});

jest.mock(
  '../Serialize',
  () =>
    function Serialize() {
      return null;
    },
);

const helmetMock = require.requireMock('react-helmet');

describe('<Html />', () => {
  beforeEach(() => {
    helmetMock.renderStatic.mockReset();
    helmetMock.renderStatic.mockImplementation(mockHelmet);
  });

  const mockProps = {children: <div />};

  it('defaults to setting the lang to "en" on the html', () => {
    const html = mount(<Html {...mockProps} />);
    expect(html.find('html').prop('lang')).toBe('en');
  });

  it('hides the body contents in development', () => {
    const html = withEnv('development', () => mount(<Html {...mockProps} />));
    expect(html.find('body').prop('style')).toMatchObject({
      visibility: 'hidden',
    });
  });

  it('does not hide the body contents in other environments', () => {
    const html = mount(<Html {...mockProps} />);
    const styles = html.find('#app').prop('style') || {};
    expect(styles).not.toHaveProperty('visibility');
  });

  describe('locale', () => {
    it('defaults to setting the lang to "en" on the html', () => {
      const html = mount(<Html {...mockProps} />);
      expect(html.find('html').prop('lang')).toBe('en');
    });

    it('sets the HTML lang to an explicitly passed locale', () => {
      const locale = 'fr';
      const html = mount(<Html {...mockProps} locale={locale} />);
      expect(html.find('html').prop('lang')).toBe(locale);
    });
  });

  describe('children', () => {
    it('is used as the content of the app host node', () => {
      const html = mount(<Html {...mockProps}>hello world</Html>);
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
      const html = mount(<Html {...mockProps} scripts={scripts} />);
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
      const html = mount(<Html {...mockProps} blockingScripts={scripts} />);
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
      const html = mount(<Html {...mockProps} styles={styles} />);
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

  describe('headMarkup', () => {
    it('renders headMarkup in the head before the sync scripts', () => {
      const headMarkup = <Serialize id="data" data={{}} />;
      const html = mount(
        <Html
          {...mockProps}
          headMarkup={headMarkup}
          blockingScripts={[{path: 'foo.js'}]}
        />,
      );
      const headContents = html.find('head').children();

      const serializerIndex = findIndex(headContents, element =>
        element.is(Serialize),
      );

      const scriptsIndex = findIndex(headContents, element =>
        element.is(Script),
      );

      expect(serializerIndex).toBeLessThan(scriptsIndex);
    });
  });

  describe('bodyMarkup', () => {
    it('renders bodyMarkup in the head before the deferred scripts', () => {
      const bodyMarkup = <Serialize id="data" data={{}} />;
      const html = mount(
        <Html
          {...mockProps}
          bodyMarkup={bodyMarkup}
          scripts={[{path: 'foo.js'}]}
        />,
      );
      const bodyContent = html.find('body').children();

      const serializerIndex = findIndex(bodyContent, element =>
        element.is(Serialize),
      );

      const scriptsIndex = findIndex(bodyContent, element =>
        element.is(Script),
      );

      expect(serializerIndex).toBeLessThan(scriptsIndex);
    });
  });

  describe('manager', () => {
    it('renders serializations', () => {
      const id = 'MySerialization';
      const data = {foo: 'bar'};
      const manager = new Manager({isServer: true});
      manager.setSerialization(id, data);

      const html = mount(<Html {...mockProps} manager={manager} />);

      expect(html.find(Serialize).props()).toMatchObject({
        id,
        data,
      });
    });

    it('renders a title', () => {
      const title = 'Shopify';
      const manager = new Manager();
      manager.addTitle(title);

      const html = mount(<Html {...mockProps} manager={manager} />);

      expect(html.find('title').prop('children')).toBe(title);
    });

    it('renders meta tags with the managed attribute', () => {
      const metaOne = {content: 'foo'};
      const metaTwo = {content: 'bar'};

      const manager = new Manager();
      manager.addMeta(metaOne);
      manager.addMeta(metaTwo);

      const html = mount(<Html {...mockProps} manager={manager} />);

      expect(
        html
          .find('meta')
          .at(0)
          .props(),
      ).toEqual({[MANAGED_ATTRIBUTE]: true, ...metaOne});

      expect(
        html
          .find('meta')
          .at(1)
          .props(),
      ).toEqual({[MANAGED_ATTRIBUTE]: true, ...metaTwo});
    });

    it('renders link tags with the managed attribute', () => {
      const linkOne = {src: 'foo'};
      const linkTwo = {src: 'bar'};

      const manager = new Manager();
      manager.addLink(linkOne);
      manager.addLink(linkTwo);

      const html = mount(<Html {...mockProps} manager={manager} />);

      expect(
        html
          .find('link')
          .at(0)
          .props(),
      ).toEqual({[MANAGED_ATTRIBUTE]: true, ...linkOne});

      expect(
        html
          .find('link')
          .at(1)
          .props(),
      ).toEqual({[MANAGED_ATTRIBUTE]: true, ...linkTwo});
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
