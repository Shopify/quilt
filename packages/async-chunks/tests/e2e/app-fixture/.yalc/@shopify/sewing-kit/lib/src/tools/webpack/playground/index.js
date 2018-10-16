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
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const fs_extra_1 = require("fs-extra");
const utilities_1 = require("../../../utilities");
const utilities_2 = require("../utilities");
const client_1 = require("./client");
const utilities_3 = require("../../utilities");
const fetch = require('isomorphic-fetch');
const TASK = Symbol('Playground');
function runPlayground(workspace, { gist, force } = {}, runner) {
    return __awaiter(this, void 0, void 0, function* () {
        if (runner.hasPerformed(TASK)) {
            return;
        }
        runner.perform(TASK);
        const { project: { usesTypeScript }, paths: { playground, private: privateDir } } = workspace;
        const { format } = yield Promise.resolve().then(() => require('prettier'));
        const privatePlaygroundPath = path_1.resolve(privateDir, 'playground');
        const entryPoint = path_1.resolve(privatePlaygroundPath, 'index.js');
        const markupPath = path_1.resolve(privatePlaygroundPath, 'index.html');
        const playgroundFile = path_1.resolve(playground, `Playground.${usesTypeScript ? 'tsx' : 'js'}`);
        const playgroundImportPath = path_1.relative(path_1.dirname(entryPoint), playgroundFile);
        yield Promise.all([utilities_3.makeGitIgnoredDirectory(playground), utilities_3.makePrivateDirectory(workspace)]);
        yield fs_extra_1.mkdirp(privatePlaygroundPath);
        const playgroundContent = gist ? yield loadContentFromGist(gist) : playgroundForWorkspace(workspace);
        const filesToAdd = [];
        if (force || !(yield fs_extra_1.pathExists(playgroundFile))) {
            filesToAdd.push(fs_extra_1.writeFile(playgroundFile, format(playgroundContent)));
        }
        if (force || !(yield fs_extra_1.pathExists(entryPoint))) {
            filesToAdd.push(fs_extra_1.writeFile(entryPoint, format(`
          import * as React from 'react';
          import {render} from 'react-dom';
          import {AppContainer} from 'react-hot-loader';

          function renderPlayground() {
            const Playground = require('${playgroundImportPath}').default;
            render(<AppContainer><Playground /></AppContainer>, document.getElementById('root'));
          }

          renderPlayground();

          if (module.hot) {
            module.hot.accept('./${path_1.basename(entryPoint)}');
            module.hot.accept('${playgroundImportPath}', renderPlayground);
          }
        `)));
        }
        if (force || !(yield fs_extra_1.pathExists(markupPath))) {
            filesToAdd.push(writeFileWithCorrectIndentation(markupPath, `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>Playground</title>
        </head>
        <body>
          <div id="root"></div>
          <script src="/assets/main.js"></script>
        </body>
      </html>
    `));
        }
        yield Promise.all(filesToAdd);
        // This is really dumb. Webpack cycles for 10 seconds when running
        // initially to catch potential changes to files. Here, we set the
        // initial time back 10 seconds to "trick" Webpack. Without this,
        // we get 3-5 compilations at the beginning.
        // https://github.com/webpack/watchpack/issues/25
        const then = Date.now() / 1000 - 10;
        yield Promise.all([fs_extra_1.utimes(entryPoint, then, then), fs_extra_1.utimes(playgroundFile, then, then)]);
        yield openPlaygroundFile(playgroundFile);
        const client = new client_1.default(entryPoint, workspace);
        client.on('compile', () => {
            runner.logger.info(chalk => `${chalk.bold('[playground]')} Compiling`);
        }).on('done', stats => {
            utilities_2.logStats(runner, stats, { name: 'playground' });
        });
        const { host, port } = yield client.run();
        runner.logger.info(chalk => `${chalk.bold('[playground]')} Running on ${host}:${port}`);
    });
}
exports.default = runPlayground;
function openPlaygroundFile(file) {
    return __awaiter(this, void 0, void 0, function* () {
        const contents = yield fs_extra_1.readFile(file, 'utf8');
        const positionOfFirstClosingJSX = />(?! \{)/.exec(contents);
        const line = contents.slice(0, positionOfFirstClosingJSX ? positionOfFirstClosingJSX.index : 0).split('\n').length + 1;
        yield utilities_3.openFile(file, { line, column: 9 });
    });
}
function playgroundForWorkspace(workspace) {
    const { project: { usesTypeScript, usesPolaris } } = workspace;
    const disableCommand = 'eslint-disable';
    const enableCommand = 'eslint-enable';
    const openingTag = usesPolaris ? '<AppProvider><Page title="Playground">' : '<div>';
    const closingTag = usesPolaris ? '</Page></AppProvider>' : '</div>';
    const preambleStatements = utilities_1.flatten([usesPolaris && `import {AppProvider, Page} from '@shopify/polaris';`, usesTypeScript && '\ninterface State {}']);
    const preamble = preambleStatements.length > 0 ? `${preambleStatements.join('\n')}\n` : '\n';
    return `
    // ${disableCommand}

    import * as React from 'react';
    ${preamble}
    export default class Playground extends React.Component${usesTypeScript ? '<never, State>' : ''} {
      state${usesTypeScript ? ': State' : ''} = {};

      render() {
        return (
          ${openingTag}
          Add content here.
          ${closingTag}
        );
      }
    }

    // ${enableCommand}
  `;
}
function loadContentFromGist(gist) {
    return __awaiter(this, void 0, void 0, function* () {
        const idMatches = gist.match(/[a-z0-9]+$/);
        if (idMatches == null) {
            throw new Error(`Invalid gist URL: ${gist}`);
        }
        const gistResponse = yield fetch(`https://api.github.com/gists/${idMatches[0]}`);
        const { files } = yield gistResponse.json();
        return files[Object.keys(files)[0]].content;
    });
}
function writeFileWithCorrectIndentation(file, content) {
    return __awaiter(this, void 0, void 0, function* () {
        const trimmedContent = content.replace(/^\n+/, '');
        const indentation = (/^\s*/.exec(trimmedContent) || [''])[0].length;
        const finalContent = trimmedContent.replace(new RegExp(`^ {0,${indentation}}`, 'gm'), '');
        yield fs_extra_1.writeFile(file, `${finalContent.replace(/\s*$/, '')}\n`);
    });
}