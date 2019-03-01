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

      return manager.subscribe((state) => {
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

    titleElement.setAttribute(MANAGED_ATTRIBUTE, 'true');
    titleElement.textContent = title;
  }

  const fragment = document.createDocumentFragment();

  for (const meta of metas) {
    const element = document.createElement('meta');
    element.setAttribute(MANAGED_ATTRIBUTE, 'true');

    for (const [attribute, value] of Object.entries(meta)) {
      element.setAttribute(attribute, value);
    }

  } else {
    if (titleElement == null) {
      titleElement = document.createElement('title');
      document.head.appendChild(titleElement);
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

export {HtmlManagerProvider as Provider, Context};
