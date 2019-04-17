import * as path from 'path';
import {transformAsync, TransformOptions} from '@babel/core';
import i18nBabelPlugin from '../babel-plugin';

jest.mock('string-hash', () => () => {
  return Number.MAX_SAFE_INTEGER;
});

describe('babel-pluin-react-i18n', () => {
  const defaultHash = Number.MAX_SAFE_INTEGER.toString(36).substr(0, 5);

  it('injects arguments into withI18n when adjacent translations exist', async () => {
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
            const dictionary = await import(/* webpackChunkName: "MyComponent_${defaultHash}-i18n", webpackMode: "lazy-once" */ \`./translations/$\{locale}.json\`);
            return dictionary && dictionary.default;
          },
        })(MyComponent);
        `,
      ),
    );
  });

  it('injects arguments into useI18n when adjacent translations exist', async () => {
    expect(
      await transform(
        `import React from 'react';
        import {useI18n} from '@shopify/react-i18n';

        export default function MyComponent() {
          const [i18n] = useI18n();
          return i18n.translate('key');
        }
        `,
        optionsForFile('MyComponent.tsx', true),
      ),
    ).toBe(
      await normalize(
        `import React from 'react';
        import {useI18n} from '@shopify/react-i18n';
        import _en from './translations/en.json';

        export default function MyComponent() {
          const [i18n] = useI18n({
            id: 'MyComponent_${defaultHash}',
            fallback: _en,
            async translations(locale) {
              const dictionary = await import(/* webpackChunkName: "MyComponent_${defaultHash}-i18n", webpackMode: "lazy-once" */ \`./translations/$\{locale}.json\`);
              return dictionary && dictionary.default;
            },
          });
          return i18n.translate('key');
        }
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

  it('does not transform other react-i18n imports', async () => {
    expect(
      await transform(
        `import React from 'react';
        import {withI18n, translate} from '@shopify/react-i18n';

        function MyComponent({i18n}) {
          return i18n.translate('key');
        }
        export const key = translate('key');

        export default withI18n()(MyComponent);
        `,
        optionsForFile('MyComponent.tsx', true),
      ),
    ).toBe(
      await normalize(
        `import React from 'react';
        import {withI18n, translate} from '@shopify/react-i18n';
        import _en from './translations/en.json';

        function MyComponent({i18n}) {
          return i18n.translate('key');
        }

        export const key = translate('key');

        export default withI18n({
          id: 'MyComponent_${defaultHash}',
          fallback: _en,
          async translations(locale) {
            const dictionary = await import(/* webpackChunkName: "MyComponent_${defaultHash}-i18n", webpackMode: "lazy-once" */ \`./translations/$\{locale}.json\`);
            return dictionary && dictionary.default;
          },
        })(MyComponent);
        `,
      ),
    );
  });

  it('does not transform withI18n imports from other libraries', async () => {
    const code = await normalize(`import React from 'react';
    import {withI18n} from 'some-other-lib';

    function MyComponent({i18n}) {
      return i18n.translate('key');
    }

    export default withI18n()(MyComponent);
    `);

    expect(await transform(code, optionsForFile('MyComponent.tsx', true))).toBe(
      code,
    );
  });

  it('does not transform useI18n imports from other libraries', async () => {
    const code = await normalize(`import React from 'react';
    import {useI18n} from 'some-other-lib';

    export default function MyComponent() {
      const [i18n] = useI18n();
      return i18n.translate('key');
    }
    `);

    expect(await transform(code, optionsForFile('MyComponent.tsx', true))).toBe(
      code,
    );
  });

  it('transforms withI18n when it was renamed during import', async () => {
    expect(
      await transform(
        `import React from 'react';
        import {withI18n as foo} from '@shopify/react-i18n';

        function MyComponent({i18n}) {
          return i18n.translate('key');
        }

        export default foo()(MyComponent);
        `,
        optionsForFile('MyComponent.tsx', true),
      ),
    ).toBe(
      await normalize(
        `import React from 'react';
        import {withI18n as foo} from '@shopify/react-i18n';
        import _en from './translations/en.json';

        function MyComponent({i18n}) {
          return i18n.translate('key');
        }

        export default foo({
          id: 'MyComponent_${defaultHash}',
          fallback: _en,
          async translations(locale) {
            const dictionary = await import(/* webpackChunkName: "MyComponent_${defaultHash}-i18n", webpackMode: "lazy-once" */ \`./translations/$\{locale}.json\`);
            return dictionary && dictionary.default;
          },
        })(MyComponent);
        `,
      ),
    );
  });

  it('transforms useI18n when it was renamed during import', async () => {
    expect(
      await transform(
        `import React from 'react';
        import {useI18n as useFunI18n} from '@shopify/react-i18n';

        export default function MyComponent() {
          const [i18n] = useFunI18n();
          return i18n.translate('key');
        }
        `,
        optionsForFile('MyComponent.tsx', true),
      ),
    ).toBe(
      await normalize(
        `import React from 'react';
        import {useI18n as useFunI18n} from '@shopify/react-i18n';
        import _en from './translations/en.json';

        export default function MyComponent() {
          const [i18n] = useFunI18n({
            id: 'MyComponent_${defaultHash}',
            fallback: _en,
            async translations(locale) {
              const dictionary = await import(/* webpackChunkName: "MyComponent_${defaultHash}-i18n", webpackMode: "lazy-once" */ \`./translations/$\{locale}.json\`);
              return dictionary && dictionary.default;
            },
          });
          return i18n.translate('key');
        }
        `,
      ),
    );
  });

  it('does not transform withI18n when it already has arguments', async () => {
    const code = await normalize(`import React from 'react';
      import {withI18n} from '@shopify/react-i18n';

      function MyComponent({i18n}) {
        return i18n.translate('key');
      }

      export default withI18n({id: 'foo'})(MyComponent);
    `);

    expect(await transform(code, optionsForFile('MyComponent.tsx', true))).toBe(
      code,
    );
  });

  it('does not transform useI18n when it already has arguments', async () => {
    const code = await normalize(`
      import React from 'react';
      import {useI18n} from '@shopify/react-i18n';

      export default function MyComponent() {
        const [i18n] = useI18n({id: 'Foo'});
        return i18n.translate('key');
      }
    `);

    expect(await transform(code, optionsForFile('MyComponent.tsx', true))).toBe(
      code,
    );
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
    filename: dummyPath,
  };
}
