import * as React from 'react';
import Manager, {State} from './manager';
import {MANAGED_ATTRIBUTE} from './utilities';

export const HtmlContext = React.createContext<Manager | undefined>(undefined);

interface Props {
  manager?: Manager;
  children: React.ReactNode;
}

export function HtmlProvider({manager, children}: Props) {
  const queuedUpdate = React.useRef<number | null>(null);

  React.useEffect(
    () => {
      if (manager == null) {
        return;
      }

      // eslint-disable-next-line consistent-return
      return manager.subscribe(state => {
        if (queuedUpdate.current) {
          cancelAnimationFrame(queuedUpdate.current);
        }

        queuedUpdate.current = requestAnimationFrame(() => {
          updateOnClient(state);
        });
      });
    },
    [manager],
  );

  return (
    <HtmlContext.Provider value={manager}>{children}</HtmlContext.Provider>
  );
}

function updateOnClient(state: State) {
  const {title, metas, links} = state;
  let titleElement = document.querySelector('title');

  if (title == null) {
    if (titleElement) {
      titleElement.remove();
    }
  } else {
    if (titleElement == null) {
      titleElement = document.createElement('title');
      document.head.appendChild(titleElement);
    }

    titleElement.setAttribute(MANAGED_ATTRIBUTE, 'true');
    titleElement.textContent = title;
  }

  const fragment = document.createDocumentFragment();

  const oldMetas = Array.from(
    document.head.querySelectorAll(`meta[${MANAGED_ATTRIBUTE}]`),
  );

  for (const meta of metas) {
    const element = document.createElement('meta');
    element.setAttribute(MANAGED_ATTRIBUTE, 'true');

    for (const [attribute, value] of Object.entries(meta)) {
      element.setAttribute(attribute, value);
    }

    const matchingOldMetaIndex = oldMetas.findIndex(oldMeta =>
      oldMeta.isEqualNode(element),
    );

    if (matchingOldMetaIndex >= 0) {
      oldMetas.splice(matchingOldMetaIndex, 1);
    } else {
      fragment.appendChild(element);
    }
  }

  const oldLinks = Array.from(
    document.head.querySelectorAll(`link[${MANAGED_ATTRIBUTE}]`),
  );

  for (const link of links) {
    const element = document.createElement('link');
    element.setAttribute(MANAGED_ATTRIBUTE, 'true');

    for (const [attribute, value] of Object.entries(link)) {
      element.setAttribute(attribute, value);
    }

    const matchingOldLinkIndex = oldLinks.findIndex(oldLink =>
      oldLink.isEqualNode(element),
    );

    if (matchingOldLinkIndex >= 0) {
      oldLinks.splice(matchingOldLinkIndex, 1);
    } else {
      fragment.appendChild(element);
    }
  }

  for (const link of oldLinks) {
    link.remove();
  }

  for (const meta of oldMetas) {
    meta.remove();
  }

  document.head.appendChild(fragment);
}
