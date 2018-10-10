import * as babel from 'babel-core';
import babelPluginAsyncChunks from '../index';

describe('@shopify/async-chunks/babel transformation', () => {
  const code = `
    import AsyncChunks from '@shopify/async-chunks';
    const HomeIndex = AsyncChunks({
      loader: () => import(/* webpackChunkName: 'homeIndex' */ './HomeIndex'),
      loading: "Loading"
    });
  `;

  it('adds modules metadata mapped to the import path', () => {
    expect(transform(code)).toContain(`modules: ['./HomeIndex'],`);
  });
  it('adds webpack metadata mapped to the import path', () => {
    expect(transform(code)).toContain(
      `webpack: () => [require.resolveWeak('./HomeIndex')],`,
    );
  });

  it('does not change the library import', () => {
    expect(transform(code)).toContain(
      `import AsyncChunks from '@shopify/async-chunks';`,
    );
  });
  it('does not change the loader proptery', () => {
    expect(transform(code)).toContain(
      `loader: () => import( /* webpackChunkName: 'homeIndex' */'./HomeIndex'),`,
    );
  });
  it('does not change the loading proptery', () => {
    // eslint-disable-next-line no-useless-escape
    expect(transform(code)).toContain(`loading: \"Loading\"`);
  });
  it('does not transform chunks that are not imported by @shopify/async-chunks', () => {
    const code = `import Loadable from 'react-loadable';
const HomeIndex = Loadable({
  loader: () => import( /* webpackChunkName: 'homeIndex' */'./HomeIndex'),
  loading: "Loading"
});`;
    expect(transform(code)).toEqual(code);
  });
});

function transform(code) {
  return babel
    .transform(code, {
      babelrc: false,
      plugins: ['syntax-dynamic-import', [babelPluginAsyncChunks]],
    })
    .code.trim();
}
