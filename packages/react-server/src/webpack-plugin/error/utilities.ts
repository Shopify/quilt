import type {Compiler} from 'webpack';

import type {Options} from '../shared';
import {noSourceExists, HEADER, Entrypoint} from '../shared';

export function errorSSRComponentExists(options: Options, compiler: Compiler) {
  return !noSourceExists(Entrypoint.Error, options, compiler);
}

export function errorClientSource() {
  return `
    ${HEADER}
    import React from 'react';
    import ReactDOM from 'react-dom/client';
    import {showPage} from '@shopify/react-html';
    import Error from 'error';
    const appContainer = document.getElementById('app');
    ReactDOM.hydrateRoot(appContainer, React.createElement(Error));
    showPage();
  `;
}
