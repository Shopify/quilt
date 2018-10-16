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
