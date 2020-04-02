import path from 'path';

import {transformAsync, TransformOptions} from '@babel/core';

import i18nBabelPlugin, {Options} from '../index';
import {TRANSLATION_DIRECTORY_NAME} from '../shared';

jest.mock('string-hash', () => () => {
  return Number.MAX_SAFE_INTEGER;
});

const defaultHash = Number.MAX_SAFE_INTEGER.toString(36).substr(0, 5);

describe('babel-pluin-react-i18n', () => {
  const withI18nFixture = `import React from 'react';
  import {withI18n} from '@shopify/react-i18n';

  function MyComponent({i18n}) {
    return i18n.translate('key');
  }

  export default withI18n()(MyComponent);
  `;

  const useI18nFixture = `import React from 'react';
  import {useI18n} from '@shopify/react-i18n';

  export default function MyComponent() {
    const [i18n] = useI18n();
    return i18n.translate('key');
  }
  `;

  it('injects arguments into withI18n when adjacent translations exist', async () => {
    expect(
      await transformUsingI18nBabelPlugin(
        withI18nFixture,
        optionsForFile('MyComponent.tsx', true),
      ),
    ).toBe(
      await normalize(
        `import _en from './${TRANSLATION_DIRECTORY_NAME}/en.json';
        import React from 'react';
        import {withI18n} from '@shopify/react-i18n';

        function MyComponent({i18n}) {
          return i18n.translate('key');
        }

        export default withI18n({
          id: 'MyComponent_${defaultHash}',
          fallback: _en,
          ${createExpectedTranslationsOption()}
        })(MyComponent);
        `,
      ),
    );
  });

  it('injects arguments into useI18n when adjacent translations exist', async () => {
    expect(
      await transformUsingI18nBabelPlugin(
        useI18nFixture,
        optionsForFile('MyComponent.tsx', true),
      ),
    ).toBe(
      await normalize(
        `import _en from './${TRANSLATION_DIRECTORY_NAME}/en.json';
        import React from 'react';
        import {useI18n} from '@shopify/react-i18n';

        export default function MyComponent() {
          const [i18n] = useI18n({
            id: 'MyComponent_${defaultHash}',
            fallback: _en,
            ${createExpectedTranslationsOption()}
          });
          return i18n.translate('key');
        }
        `,
      ),
    );
  });

  it('does not inject arguments when no adjacent translations exist', async () => {
    const code = await normalize(
      `import React from 'react';
      import {withI18n} from '@shopify/react-i18n';

      function MyComponent({i18n}) {
        return i18n.translate('key');
      }

      export default withI18n()(MyComponent);
      `,
    );

    expect(
      await transformUsingI18nBabelPlugin(
        code,
        optionsForFile('MyComponent.tsx'),
      ),
    ).toBe(code);
  });

  it('does not transform other react-i18n imports', async () => {
    const content = `
      import React from 'react';
      import {withFoo} from '@shopify/react-i18n';

      function MyComponent({i18n}) {
        return i18n.translate('key');
      }
      export const key = translate('key');

      export default withFoo()(MyComponent);
    `;

    expect(
      await transformUsingI18nBabelPlugin(
        content,
        optionsForFile('MyComponent.tsx', true),
      ),
    ).toBe(await normalize(content));
  });

  it('does not transform withI18n imports from other libraries', async () => {
    const code = await normalize(`import React from 'react';
    import {withI18n} from 'some-other-lib';

    function MyComponent({i18n}) {
      return i18n.translate('key');
    }

    export default withI18n()(MyComponent);
    `);

    expect(
      await transformUsingI18nBabelPlugin(
        code,
        optionsForFile('MyComponent.tsx', true),
      ),
    ).toBe(code);
  });

  it('does not transform useI18n imports from other libraries', async () => {
    const code = await normalize(`import React from 'react';
    import {useI18n} from 'some-other-lib';

    export default function MyComponent() {
      const [i18n] = useI18n();
      return i18n.translate('key');
    }
    `);

    expect(
      await transformUsingI18nBabelPlugin(
        code,
        optionsForFile('MyComponent.tsx', true),
      ),
    ).toBe(code);
  });

  it('transforms withI18n when it was renamed during import', async () => {
    expect(
      await transformUsingI18nBabelPlugin(
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
        `import _en from './${TRANSLATION_DIRECTORY_NAME}/en.json';
        import React from 'react';
        import {withI18n as foo} from '@shopify/react-i18n';

        function MyComponent({i18n}) {
          return i18n.translate('key');
        }

        export default foo({
          id: 'MyComponent_${defaultHash}',
          fallback: _en,
          ${createExpectedTranslationsOption()}
        })(MyComponent);
        `,
      ),
    );
  });

  it('transforms useI18n when it was renamed during import', async () => {
    expect(
      await transformUsingI18nBabelPlugin(
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
        `import _en from './${TRANSLATION_DIRECTORY_NAME}/en.json';
        import React from 'react';
        import {useI18n as useFunI18n} from '@shopify/react-i18n';

        export default function MyComponent() {
          const [i18n] = useFunI18n({
            id: 'MyComponent_${defaultHash}',
            fallback: _en,
            ${createExpectedTranslationsOption()}
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

    expect(
      await transformUsingI18nBabelPlugin(
        code,
        optionsForFile('MyComponent.tsx', true),
      ),
    ).toBe(code);
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

    expect(
      await transformUsingI18nBabelPlugin(
        code,
        optionsForFile('MyComponent.tsx', true),
      ),
    ).toBe(code);
  });

  it('throws when multiple components in a single file request translations', async () => {
    const code = await normalize(`
      import React from 'react';
      import {useI18n} from '@shopify/react-i18n';

      function MyOtherComponent() {
        const [i18n] = useI18n();
      }

      export default function MyComponent() {
        const [i18n] = useI18n();
        return i18n.translate('key');
      }
    `);

    await expect(
      transformUsingI18nBabelPlugin(
        code,
        optionsForFile('MyComponent.tsx', true),
      ),
    ).rejects.toHaveProperty(
      'message',
      expect.stringContaining(
        'You attempted to use useI18n 2 times in a single file. This is not supported by the Babel plugin that automatically inserts translations.',
      ),
    );
  });

  it('injects arguments with translations import into useI18n when mode equals to from-generated-index', async () => {
    expect(
      await transformUsingI18nBabelPlugin(
        useI18nFixture,
        optionsForFile('MyComponent.tsx', true),
        {mode: 'from-generated-index'},
      ),
    ).toBe(
      await normalize(
        `import __shopify__i18n_translations from './translations';
        import _en from './${TRANSLATION_DIRECTORY_NAME}/en.json';
        import React from 'react';
        import {useI18n} from '@shopify/react-i18n';

        export default function MyComponent() {
          const [i18n] = useI18n({
            id: 'MyComponent_${defaultHash}',
            fallback: _en,
            ${createExpectedTranslationsOption({
              translationArrayString: '__shopify__i18n_translations',
            })}
          });
          return i18n.translate('key');
        }
        `,
      ),
    );
  });

  it('loads fr.json as default translation when defaultLocale is set to fr', async () => {
    expect(
      await transformUsingI18nBabelPlugin(
        withI18nFixture,
        optionsForFile('MyComponent.tsx', true),
        {defaultLocale: 'fr'},
      ),
    ).toBe(
      await normalize(
        `import _fr from './${TRANSLATION_DIRECTORY_NAME}/fr.json';
        import React from 'react';
        import {withI18n} from '@shopify/react-i18n';

        function MyComponent({i18n}) {
          return i18n.translate('key');
        }

        export default withI18n({
          id: 'MyComponent_${defaultHash}',
          fallback: _fr,
          ${createExpectedTranslationsOption({
            translationArrayString: '["de", "en", "zh-TW"]',
          })}
        })(MyComponent);
        `,
      ),
    );
  });

  describe('from-dictionary-index', () => {
    it('injects a dictionary import, and returns dictionary values from useI18n', async () => {
      expect(
        await transformUsingI18nBabelPlugin(
          useI18nFixture,
          optionsForFile('MyComponent.tsx', true),
          {mode: 'from-dictionary-index'},
        ),
      ).toBe(
        await normalize(
          `import __shopify__i18n_translations from './translations';
          import React from 'react';
          import {useI18n} from '@shopify/react-i18n';

          export default function MyComponent() {
            const [i18n] = useI18n({
              id: 'MyComponent_${defaultHash}',
              fallback: Object.values(__shopify__i18n_translations)[0],
              translations(locale) {
                return Promise.resolve(__shopify__i18n_translations[locale]);
              }
            });
            return i18n.translate('key');
          }
          `,
        ),
      );
    });
  });
});

async function transformUsingI18nBabelPlugin(
  code: string,
  transformOptions: Partial<TransformOptions> = {},
  pluginOptions: Options = {},
) {
  const result = await transformAsync(code, {
    plugins: [[i18nBabelPlugin, pluginOptions]],
    ...transformOptions,
    configFile: false,
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

async function normalize(code: string) {
  const result = await transformAsync(code, {
    plugins: [require('@babel/plugin-syntax-dynamic-import')],
    configFile: false,
  });

  return (result && result.code) || '';
}

function createExpectedTranslationsOption(
  options: {
    translationArrayString?: string;
  } = {},
) {
  const {translationArrayString = '["de", "fr", "zh-TW"]'} = options;

  return `
  translations(locale) {
    if (${translationArrayString}.indexOf(locale) < 0) {
      return;
    }

    return (async () => {
      const dictionary = await import(/* webpackChunkName: "MyComponent_${defaultHash}-i18n", webpackMode: "lazy-once" */ \`./${TRANSLATION_DIRECTORY_NAME}/$\{locale}.json\`);
      return dictionary && dictionary.default;
    })();
  }
`;
}
