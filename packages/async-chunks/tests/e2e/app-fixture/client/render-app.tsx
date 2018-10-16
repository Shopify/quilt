import * as React from 'react';
import * as ReactDOM from 'react-dom';

export default function renderApp(
  appContainerElement: HTMLElement | null,
  App: React.ComponentType,
) {
  if (appContainerElement) {
    ReactDOM.hydrate(<App />, appContainerElement);
  }
}
