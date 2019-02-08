import * as path from 'path';
import {transformAsync, TransformOptions} from '@babel/core';
import i18nBabelPlugin from '../babel-plugin';

jest.mock('string-hash', () => () => {
  return Number.MAX_SAFE_INTEGER;
});

describe('babel-pluin-react-i18n', () => {
  const defaultHash = Number.MAX_SAFE_INTEGER.toString(36).substr(0, 5);

  it('injects arguments when adjacent translations exist', async () => {
    expect(
      await transform(
        `import React from 'react';
        import {withI18n} from '@shopify/react-i18n';

        function MyComponent({i18n}) {
          return i18n.translate('key');
        }

        export default withI18n()(MyComponent);
        `,
        optionsForFile('MyComponent.tsx', true),
      ),
    ).toBe(
      await normalize(
        `import React from 'react';
        import {withI18n} from '@shopify/react-i18n';
        import _en from './translations/en.json';

        function MyComponent({i18n}) {
          return i18n.translate('key');
        }

        export default withI18n({
          id: 'MyComponent_${defaultHash}',
          fallback: _en,
          async translations(locale) {
            try {
              const dictionary = await import(/* webpackChunkName: 'MyComponent_${defaultHash}-i18n' */ \`./translations/$\{locale}.json\`);
              return dictionary;
            } catch (err) {}
          },
        })(MyComponent);
        `,
      ),
    );
  });

  it('does not inject arguments when no adjacent translations exist', async () => {
    const code = await normalize(
      `import * as React from 'react';
      import {withI18n} from '@shopify/react-i18n';

      function MyComponent({i18n}) {
        return i18n.translate('key');
      }

      export default withI18n()(MyComponent);
      `,
    );

    expect(await transform(code, optionsForFile('MyComponent.tsx'))).toBe(code);
  });

  it('does not make changes when no decorator is present', async () => {
    const code = await normalize(
      `import * as React from 'react';

      function MyComponent() {
        return 'some string';
      }

      export default MyComponent;
      `,
    );

    expect(await transform(code, optionsForFile('MyComponent.tsx'))).toBe(code);
  });
});
async function normalize(code: string) {
  const result = await transformAsync(code, {
    plugins: ['@babel/plugin-syntax-dynamic-import'],
  });

  return (result && result.code) || '';
}

async function transform(
  code: string,
  transformOptions: Partial<TransformOptions> = {},
) {
  const result = await transformAsync(code, {
    plugins: [i18nBabelPlugin],
    ...transformOptions,
  });

  return (result && result.code) || '';
}

function optionsForFile(filename, withTranslations = false) {
  const dummyPath = withTranslations
    ? path.join(__dirname, 'fixtures', 'adjacentTranslations', filename)
    : path.join(__dirname, 'fixtures', filename);
  return {
    sourceRoot: __dirname,
    filename: dummyPath,
    filenameRelative: path.relative(__dirname, dummyPath),
  };
}
