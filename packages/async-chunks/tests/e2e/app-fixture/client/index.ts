import {preloadReady} from '@shopify/async-chunks';
import App from '../app';
import renderApp from './render-app';

const appContainer: HTMLElement | null = document.getElementById('app');

preloadReady()
  .then(() => {
    renderApp(appContainer, App);
  })
  // eslint-disable-next-line no-console
  .catch((error: any) => console.log(error));

if (module.hot) {
  module.hot.accept('./index.ts');
  module.hot.accept('../app', () => {
    const NewApp = require('../app').default;
    renderApp(appContainer, NewApp);
  });
}
