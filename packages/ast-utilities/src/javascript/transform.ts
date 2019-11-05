import * as babel from '@babel/core';

import {parse, parseSync} from './parse';
import {compose} from './utilities';

export async function transform(
  code: string | false | undefined,
  ...transforms: babel.PluginItem[]
) {
  if (!code) {
    return '';
  }
  const ast = await parse(code);
  if (ast === null) {
    return '';
  }

  const output = await babel.transformFromAstAsync(ast, code, {
    plugins: compose(...transforms),
    configFile: false,
    generatorOpts: {
      retainLines: true,
    },
  });

  return output && output.code ? output.code : '';
}

export function transformSync(
  code: string | false | undefined,
  ...transforms: babel.PluginItem[]
) {
  if (!code) {
    return '';
  }
  const ast = parseSync(code);
  if (ast === null) {
    return '';
  }

  const output = babel.transformFromAstSync(ast, code, {
    plugins: compose(...transforms),
    configFile: false,
    generatorOpts: {
      retainLines: true,
    },
  });

  return output && output.code ? output.code : '';
}
