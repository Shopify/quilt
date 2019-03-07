import * as React from 'react';
import {mount} from 'enzyme';
import {animationFrame} from '@shopify/jest-dom-mocks';

import {Provider} from '../context';
import Manager from '../manager';
import {MANAGED_ATTRIBUTE} from '../utilities';

describe('<Provider />', () => {
  beforeEach(() => {
    animationFrame.mock();
  });

  afterEach(() => {
    animationFrame.restore();

    for (const element of document.querySelectorAll(`[${MANAGED_ATTRIBUTE}]`)) {
      element.remove();
    }
  });

  it('queues updates to HTML details', () => {
    const title = 'Shopify';
    const meta = {content: 'foo'};
    const link = {src: 'bar'};
    const manager = new Manager();

    mount(
      <Provider manager={manager}>
        <div />
      </Provider>,
    );

    manager.addTitle(title);
    manager.addLink(link);
    manager.addMeta(meta);

    expect(document.querySelectorAll(`[${MANAGED_ATTRIBUTE}]`)).toHaveLength(0);

    animationFrame.runFrame();

    expect(
      // eslint-disable-next-line typescript/no-non-null-assertion
      document
        .querySelector(`meta[${MANAGED_ATTRIBUTE}]`)!
        .getAttribute('content'),
    ).toBe(meta.content);

    expect(
      // eslint-disable-next-line typescript/no-non-null-assertion
      document.querySelector(`link[${MANAGED_ATTRIBUTE}]`)!.getAttribute('src'),
    ).toBe(link.src);

    expect(
      // eslint-disable-next-line typescript/no-non-null-assertion
      document.querySelector(`title[${MANAGED_ATTRIBUTE}]`)!.textContent,
    ).toBe(title);
  });

  it('does not remove matching link elements on subsequent changes', () => {
    const linkOne = {src: 'foo'};
    const linkTwo = {src: 'bar'};
    const manager = new Manager();

    mount(
      <Provider manager={manager}>
        <div />
      </Provider>,
    );

    manager.addLink(linkOne);
    animationFrame.runFrame();

    // eslint-disable-next-line typescript/no-non-null-assertion
    const linkElement = document.querySelector(`link[${MANAGED_ATTRIBUTE}]`)!;

    manager.addLink(linkTwo);
    animationFrame.runFrame();

    const allLinks = Array.from(
      document.querySelectorAll(`link[${MANAGED_ATTRIBUTE}]`),
    );

    expect(linkElement.getAttribute('src')).toBe(linkOne.src);
    expect(linkElement).toBe(allLinks[0]);
    expect(allLinks[1].getAttribute('src')).toBe(linkTwo.src);
  });

  it('does not remove matching meta elements on subsequent changes', () => {
    const metaOne = {content: 'foo'};
    const metaTwo = {content: 'bar'};
    const manager = new Manager();

    mount(
      <Provider manager={manager}>
        <div />
      </Provider>,
    );

    manager.addMeta(metaOne);
    animationFrame.runFrame();

    // eslint-disable-next-line typescript/no-non-null-assertion
    const metaElement = document.querySelector(`meta[${MANAGED_ATTRIBUTE}]`)!;

    manager.addMeta(metaTwo);
    animationFrame.runFrame();

    const allMetas = Array.from(
      document.querySelectorAll(`meta[${MANAGED_ATTRIBUTE}]`),
    );

    expect(metaElement.getAttribute('content')).toBe(metaOne.content);
    expect(metaElement).toBe(allMetas[0]);
    expect(allMetas[1].getAttribute('content')).toBe(metaTwo.content);
  });
});
