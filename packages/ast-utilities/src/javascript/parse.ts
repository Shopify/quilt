import * as babel from '@babel/core';

function createConfig() {
  return {
    sourceType: 'module' as 'module',
    configFile: false as false,
    plugins: [
      [require('@babel/plugin-transform-typescript'), {isTSX: true}],
      require('@babel/plugin-transform-react-jsx'),
    ],
  };
}

export function parse(code: string) {
  return babel.parseAsync(code, createConfig());
}

export function parseSync(code: string) {
  return babel.parse(code, createConfig());
}
