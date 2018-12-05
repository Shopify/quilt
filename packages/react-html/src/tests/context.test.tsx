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
});
