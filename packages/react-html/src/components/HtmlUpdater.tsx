import React from 'react';
import {HydrationTracker} from '@shopify/react-hydrate';

import {State} from '../manager';
import {useClientDomEffect} from '../hooks';
import {MANAGED_ATTRIBUTE} from '../utilities';

export function HtmlUpdater() {
  const queuedUpdate = React.useRef<number | null>(null);

  useClientDomEffect(manager => {
    return manager.subscribe(state => {
      if (queuedUpdate.current) {
        cancelAnimationFrame(queuedUpdate.current);
      }

      queuedUpdate.current = requestAnimationFrame(() => {
        updateOnClient(state);
      });
    });
  });

  return <HydrationTracker />;
}

function updateOnClient(state: State) {
  const {title, metas, links, inlineStyles} = state;
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

  updateElement('meta', metas, fragment);
  updateElement('link', links, fragment);
  updateElement('style', inlineStyles, fragment);

  document.head.appendChild(fragment);
}

function updateElement<T extends React.HTMLProps<HTMLElement>>(
  selector: string,
  items: T[],
  fragment: DocumentFragment,
) {
  const oldElements = Array.from(
    document.head.querySelectorAll(`${selector}[${MANAGED_ATTRIBUTE}]`),
  );

  for (const item of items) {
    const element = document.createElement(selector);
    element.setAttribute(MANAGED_ATTRIBUTE, 'true');

    for (const [attribute, value] of Object.entries(item)) {
      if (attribute === 'children') {
        element.textContent = value;
      } else {
        element.setAttribute(attribute, value);
      }
    }

    const matchingOldElementIndex = oldElements.findIndex(oldElement =>
      oldElement.isEqualNode(element),
    );

    if (matchingOldElementIndex >= 0) {
      oldElements.splice(matchingOldElementIndex, 1);
    } else {
      fragment.appendChild(element);
    }
  }

  for (const oldElement of oldElements) {
    oldElement.remove();
  }
}
