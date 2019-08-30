import React from 'react';
import {mount} from '@shopify/react-testing';
import withEnv from '@shopify/with-env';

import {Script, Style} from '../../../components';
import {HtmlManager} from '../../../manager';
import {MANAGED_ATTRIBUTE} from '../../../utilities';

import Html from '../Html';
import Serialize from '../Serialize';

jest.mock(
  '../Serialize',
  () =>
    function Serialize() {
      return null;
    },
);

describe('<Html />', () => {
  const mockProps = {children: <div />};

  it('hides the body contents in development', () => {
    const html = withEnv('development', () => mount(<Html {...mockProps} />));
    expect(html).toContainReactComponent('body', {
      style: {visibility: 'hidden'},
    });
  });

  it('does not hide the body contents in other environments', () => {
    const html = mount(<Html {...mockProps} />);
    const styles = html.find('body')!.prop('style') || {};
    expect(styles).not.toHaveProperty('visibility');
  });

  it('contains basic meta tags', () => {
    const html = mount(<Html {...mockProps} />);
    expect(html).toContainReactComponent('meta', {charSet: 'utf-8'});
    expect(html).toContainReactComponent('meta', {
      httpEquiv: 'X-UA-Compatible',
      content: 'IE=edge',
    });
    expect(html).toContainReactComponent('meta', {
      name: 'referrer',
      content: 'never',
    });
  });

  describe('locale', () => {
    it('defaults to setting the lang to "en" on the html', () => {
      const html = mount(<Html {...mockProps} />);
      expect(html).toContainReactComponent('html', {lang: 'en'});
    });

    it('sets the HTML lang to an explicitly passed locale', () => {
      const locale = 'fr';
      const html = mount(<Html {...mockProps} locale={locale} />);
      expect(html).toContainReactComponent('html', {lang: locale});
    });
  });

  describe('children', () => {
    it('is used as the content of the app host node', () => {
      const html = mount(<Html {...mockProps}>hello world</Html>);
      expect(html).toContainReactComponent('div', {
        id: 'app',
        dangerouslySetInnerHTML: {__html: 'hello world'},
      });
    });
  });

  describe('deferedScripts', () => {
    it('generates a script tag in the head with the `defer` attribute', () => {
      const scripts = [{path: 'foo.js'}, {path: 'bar.js'}];
      const html = mount(<Html {...mockProps} scripts={scripts} />);
      const head = html.find('head')!;

      for (const script of scripts) {
        expect(head).toContainReactComponent(Script, {
          defer: true,
          src: script.path,
        });
      }
    });
  });

  describe('blockingScripts', () => {
    it('generates a script tag in the head without the `defer` attribute', () => {
      const scripts = [{path: 'foo.js'}, {path: 'bar.js'}];
      const html = mount(<Html {...mockProps} blockingScripts={scripts} />);
      const head = html.find('head')!;

      for (const script of scripts) {
        expect(head).toContainReactComponent(Script, {
          src: script.path,
        });
      }
    });
  });

  describe('styles', () => {
    it('generates a link tag in the head', () => {
      const styles = [{path: 'foo.js'}, {path: 'bar.js'}];
      const html = mount(<Html {...mockProps} styles={styles} />);
      const head = html.find('head')!;

      for (const style of styles) {
        expect(head).toContainReactComponent(Style, {
          href: style.path,
        });
      }
    });
  });

  describe('preloadAssets', () => {
    it('generates a link[rel=prefetch] tag', () => {
      const asset = {path: 'foo.js'};
      const html = mount(<Html {...mockProps} preloadAssets={[asset]} />);
      expect(html.find('head')).toContainReactComponent('link', {
        rel: 'prefetch',
        href: asset.path,
      });
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
      const headContents = html.find('head')!.descendants;

      const serializerIndex = headContents.findIndex(element =>
        element.is(Serialize),
      );

      const scriptsIndex = headContents.findIndex(element =>
        element.is(Script),
      );

      expect(serializerIndex).toBeLessThan(scriptsIndex);
    });

    it('renders sync scripts in the head before deferred scripts', () => {
      const headMarkup = <Serialize id="data" data={{}} />;
      const html = mount(
        <Html
          {...mockProps}
          headMarkup={headMarkup}
          blockingScripts={[{path: 'foo.js'}]}
          scripts={[{path: 'bar.js'}]}
        />,
      );
      const headContents = html.find('head')!.descendants;

      const syncScriptsIndex = headContents.findIndex(element => {
        return element.is(Script) && !element.prop('defer');
      });

      const deferredScriptsIndex = headContents.findIndex(
        element => element.is(Script) && Boolean(element.prop('defer')),
      );

      expect(syncScriptsIndex).toBeLessThan(deferredScriptsIndex);
    });
  });

  describe('bodyMarkup', () => {
    it('renders bodyMarkup in the body', () => {
      const bodyMarkup = <Serialize id="data" data={{}} />;
      const html = mount(
        <Html
          {...mockProps}
          bodyMarkup={bodyMarkup}
          scripts={[{path: 'foo.js'}]}
        />,
      );

      expect(html.find('body')).toContainReactComponent(Serialize, {
        id: 'data',
      });
    });
  });

  describe('manager', () => {
    it('renders serializations', () => {
      const id = 'MySerialization';
      const data = {foo: 'bar'};
      const manager = new HtmlManager();
      manager.setSerialization(id, data);

      const html = mount(<Html {...mockProps} manager={manager} />);

      expect(html).toContainReactComponent(Serialize, {
        id,
        data,
      });
    });

    it('renders a title', () => {
      const title = 'Shopify';
      const manager = new HtmlManager();
      manager.addTitle(title);

      const html = mount(<Html {...mockProps} manager={manager} />);

      expect(html.find('title')).toContainReactText(title);
    });

    it('renders meta tags with the managed attribute', () => {
      const metaOne = {content: 'foo'};
      const metaTwo = {content: 'bar'};

      const manager = new HtmlManager();
      manager.addMeta(metaOne);
      manager.addMeta(metaTwo);

      const html = mount(<Html {...mockProps} manager={manager} />);
      const metas = html
        .findAll('meta')
        .filter(meta => meta.data(MANAGED_ATTRIBUTE));

      expect(metas).toHaveLength(2);
      expect(metas[0]).toHaveReactProps(metaOne);
      expect(metas[1]).toHaveReactProps(metaTwo);
    });

    it('renders link tags with the managed attribute', () => {
      const linkOne = {href: 'foo'};
      const linkTwo = {href: 'bar'};

      const manager = new HtmlManager();
      manager.addLink(linkOne);
      manager.addLink(linkTwo);

      const html = mount(<Html {...mockProps} manager={manager} />);
      const links = html
        .findAll('link')
        .filter(link => link.data(MANAGED_ATTRIBUTE));

      expect(links).toHaveLength(2);
      expect(links[0]).toHaveReactProps(linkOne);
      expect(links[1]).toHaveReactProps(linkTwo);
    });

    it('renders html attributes', () => {
      const htmlProps = {lang: 'fr'};
      const manager = new HtmlManager();
      manager.addHtmlAttributes(htmlProps);

      const html = mount(<Html {...mockProps} manager={manager} />);

      expect(html).toContainReactComponent('html', htmlProps);
    });

    it('renders body attributes', () => {
      const bodyProps = {className: 'beautiful'};
      const manager = new HtmlManager();
      manager.addBodyAttributes(bodyProps);

      const html = mount(<Html {...mockProps} manager={manager} />);

      expect(html).toContainReactComponent('body', bodyProps);
    });
  });
});
