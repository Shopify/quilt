"use strict";

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : new P(function (resolve) {
                resolve(result.value);
            }).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = this && this.__rest || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0) t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = require("chalk");
const path_1 = require("path");
const fs_extra_1 = require("fs-extra");
const env_1 = require("../../env");
const runner_1 = require("../../runner");
const workspace_1 = require("../../workspace");
const common_1 = require("./common");
exports.command = 'generate <component>';
exports.desc = 'generates boilerplate for new React components';
exports.builder = common_1.options;
function handler(_a) {
    var { component } = _a,
        options = __rest(_a, ["component"]);
    return __awaiter(this, void 0, void 0, function* () {
        const runner = new runner_1.default(new runner_1.Logger(options.logLevel));
        const { project: { usesTypeScript }, paths } = yield workspace_1.default(new env_1.default(), runner, options);
        const parts = component.split('/');
        const name = parts[parts.length - 1];
        let targetDir;
        if (parts.length === 1) {
            targetDir = path_1.join(paths.components, parts[0]);
        } else {
            targetDir = path_1.join(paths.sections, ...parts.slice(0, parts.length - 1), 'components', name);
        }
        yield fs_extra_1.mkdirp(targetDir);
        yield Promise.all([writeFileSyncWithCorrectIndentation(path_1.resolve(targetDir, `${name}.${usesTypeScript ? 'tsx' : 'js'}`), `
      import * as React from 'react';
      import {classNames} from '@shopify/react-utilities/styles';
      import * as styles from './${name}.scss';

      export interface Props {
        children?: React.ReactNode,
      }

      export default function ${name}({children}: Props) {
        const className = classNames(
          styles.${name},
        );
        return (
          <div className={className}>{children}</div>
        );
      }
    `), writeFileSyncWithCorrectIndentation(path_1.resolve(targetDir, `index.${usesTypeScript ? 'ts' : 'js'}`), `
      import ${name} from './${name}';

      export * from './${name}';
      export default ${name};
    `), writeFileSyncWithCorrectIndentation(path_1.resolve(targetDir, `${name}.scss`), `
      .${name} {

      }
    `), writeFileSyncWithCorrectIndentation(path_1.resolve(targetDir, 'README.md'), `
      ---
      name: ${name}
      category:
      keywords:
        - Only include one variation of the word. You don't need to account for Canadian spelling,
        spelling errors, plural form, hyphens, or spaces.
        - Think of words that people in different disciplines will use to search for this component.
        - Include words or short phrases that describe the structure and the functionality.
        - Be specific to increase relevancy of the results.
      ---

      # ${name}

      ${name} description

      ---

      ## Purpose

      ### Problem

      Problem description.

      ### Solution

      Solution description

      ---

      ## Best practices

      Some best practices for using this component

      ---

      ## Content guidelines

      ### Example type of content

      Guidelines for type of content

      <!-- usageblock -->
      #### Do
      Something to write

      #### Don’t
      Something to not write
      <!-- end -->

      <!-- usagelist -->
      #### Do
      Something to write

      #### Don’t
      Something to not write
      <!-- end -->

      ---

      ## Properties

      | Properties  | Type   | Description |
      | ----------- | ------ | ----------- |
      |             |        |             |

      ---

      ## Examples

      ### Basic example

      Basic example description

      \`\`\`jsx
      <Component myProp={true} />
      \`\`\`

      ### Another example

      Another example description

      \`\`\`jsx
      <Component myProp={false} />
      \`\`\`

      ---

      ## Related components

      * To do something similar but with another use case, use the [foo](/components/foo) component
    `)]);
        const indexFile = path_1.resolve(targetDir, '../index.ts');
        if (yield fs_extra_1.pathExists(indexFile)) {
            yield writeFileSyncWithCorrectIndentation(indexFile, `
      ${(yield fs_extra_1.readFile(indexFile, 'utf8')).replace(/\s+$/, '\n')}
      export {default as ${name}} from './${name}';
      export {Props as ${name}Props} from './${name}';
    `);
        } else {
            yield writeFileSyncWithCorrectIndentation(indexFile, `
      export {default as ${name}} from './${name}';
      export {Props as ${name}Props} from './${name}';
    `);
        }
    });
}
exports.handler = handler;
function writeFileSyncWithCorrectIndentation(file, content) {
    return __awaiter(this, void 0, void 0, function* () {
        const trimmedContent = content.replace(/^\n+/, '');
        const indentation = (/^\s*/.exec(trimmedContent) || [''])[0].length;
        const finalContent = trimmedContent.replace(new RegExp(`^ {1,${indentation}}`, 'gm'), '');
        yield fs_extra_1.writeFile(file, `${finalContent.replace(/\s*$/, '')}\n`);
        // eslint-disable-next-line no-warning-comments
        // TODO
        // eslint-disable-next-line no-console
        console.log(chalk_1.default.green('Wrote file: '), chalk_1.default.gray(file));
    });
}