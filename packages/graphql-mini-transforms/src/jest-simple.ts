import {createHash} from 'crypto';

import {readFileSync} from 'fs-extra';
import {Transformer} from '@jest/transform';
import {parse} from 'graphql';

import {extractImports} from './document';

const THIS_FILE = readFileSync(__filename);

export const getCacheKey: Transformer['getCacheKey'] = function getCacheKey(
  fileData,
  filename,
) {
  return createHash('md5')
    .update(THIS_FILE)
    .update(fileData)
    .update(filename)
    .digest('hex');
};

export const process: Transformer['process'] = function process(rawSource) {
  const {imports, source} = extractImports(rawSource);

  const utilityImports = `
      var {print, parse} = require('graphql');
      var {cleanDocument, toSimpleDocument} = require(${JSON.stringify(
        `${__dirname}/document.js`,
      )});
    `;

  const importSource = imports
    .map(
      (imported, index) =>
        `var importedDocument${index} = require(${JSON.stringify(imported)});`,
    )
    .join('\n');

  const appendDefinitionsSource = imports
    .map(
      (_, index) =>
        `document.definitions.push.apply(document.definitions, parse(importedDocument${index}.source).definitions);`,
    )
    .join('\n');

  return `
      ${utilityImports}
      ${importSource}

      var document = ${JSON.stringify(parse(source))};

      ${appendDefinitionsSource}

      module.exports = toSimpleDocument(cleanDocument(document, {removeUnused: false}));
    `;
};
