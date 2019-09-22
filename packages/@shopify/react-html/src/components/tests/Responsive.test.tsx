import React from 'react';

import {HtmlManager} from '../../manager';
import {Responsive} from '../Responsive';

import {mountWithManager} from './utilities';

describe('<Responsive />', () => {
  it('renders a <Meta /> with the content attribute set to `width=device-width, initial-scale=1, viewport-fit=cover` by default', () => {
    const manager = new HtmlManager();
    const spy = jest.spyOn(manager, 'addMeta');
    mountWithManager(<Responsive />, manager);

    expect(spy).toHaveBeenCalledWith({
      name: 'viewport',
      content: 'width=device-width, initial-scale=1, viewport-fit=cover',
    });
  });

  it('renders a <Meta /> without `viewport-fit=cover` in the content attribute when coverNotch is false', () => {
    const manager = new HtmlManager();
    const spy = jest.spyOn(manager, 'addMeta');
    mountWithManager(<Responsive coverNotch={false} />, manager);

    expect(spy).not.toHaveBeenCalledWith({
      name: 'viewport',
      content: expect.stringMatching(/viewport-fit=cover/),
    });
  });

  it('renders a <Meta /> with `user-scalable=no` in the content attribute when allowPinchToZoom is false', () => {
    const manager = new HtmlManager();
    const spy = jest.spyOn(manager, 'addMeta');
    mountWithManager(<Responsive allowPinchToZoom={false} />, manager);

    expect(spy).toHaveBeenCalledWith({
      name: 'viewport',
      content: expect.stringMatching(/user-scalable=no/),
    });
  });
});
