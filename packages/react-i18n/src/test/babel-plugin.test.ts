import * as path from 'path';
import {transformFile} from '@babel/core';
import BabelPluginReactI18n from '../babel-plugin';

function runFixture(fixturePath: string) {
  return new Promise<string>((resolve, reject) => {
    transformFile(
      fixturePath,
      {
        plugins: [BabelPluginReactI18n],
        sourceRoot: __dirname,
        filename: fixturePath,
        filenameRelative: path.relative(__dirname, fixturePath),
      },
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          // eslint-disable-next-line typescript/no-non-null-assertion
          resolve(result!.code!);
        }
      },
    );
  });
}

describe('babel-pluin-react-i18n', () => {
  it('injects arguments when adjacent translations exist', async () => {
    const fixturePath = path.resolve(
      __dirname,
      'fixtures',
      'adjacentTranslations',
      'MyComponent.js',
    );

    const code = await runFixture(fixturePath);
    expect(code).toMatchInlineSnapshot(`
"import React from 'react';
import { withI18n } from '@shopify/react-i18n';
import _en from './translations/en.json';

function MyComponent({
  i18n
}) {
  return i18n.translate('key');
}

export default withI18n({
  id: 'MyComponent_1qre7',
  fallback: _en,

  async translations(locale) {
    try {
      const dictionary = await import(
      /* webpackChunkName: 'MyComponent_1qre7-i18n' */
      \`./translations/\${locale}.json\`);
      return dictionary;
    } catch (err) {}
  }

})(MyComponent);"
`);
  });

  it('does not inject arguments when no adjacent translations exist', async () => {
    const fixturePath = path.resolve(
      __dirname,
      'fixtures',
      'withoutTranslations',
      'MyComponent.js',
    );

    const code = await runFixture(fixturePath);
    expect(code).toMatchInlineSnapshot(`
"import React from 'react';
import { withI18n } from '@shopify/react-i18n';

function MyComponent({
  i18n
}) {
  return i18n.translate('key');
}

export default withI18n()(MyComponent);"
`);
  });

  it('does not make changes when no decorator is present', async () => {
    const fixturePath = path.resolve(
      __dirname,
      'fixtures',
      'withoutDecorator',
      'MyComponent.js',
    );

    const code = await runFixture(fixturePath);
    expect(code).toMatchInlineSnapshot(`
"import React from 'react';

function MyComponent() {
  return 'foo';
}

export default MyComponent;"
`);
  });
});
