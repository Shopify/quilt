import React from 'react';
import {mount} from '@shopify/react-testing';
import {clock} from '@shopify/jest-dom-mocks';

import {useDelayedCallback} from '../delayed-callback';

interface Props {
  callback(): void;
  delay: number;
}

function FakeComponent({callback, delay}: Props) {
  const callbackWithDelay = useDelayedCallback(callback, delay);

  return <button onClick={callbackWithDelay} type="button" />;
}

describe('useDelayedCallback', () => {
  beforeEach(() => {
    clock.mock();
  });

  afterEach(() => {
    clock.restore();
  });

  it("doesn't call the callback right away", async () => {
    const callbackSpy = jest.fn();
    const delay = 1000;

    const fakeComponent = await mount(
      <FakeComponent callback={callbackSpy} delay={delay} />,
    );

    fakeComponent.find('button').trigger('onClick');

    expect(callbackSpy).not.toHaveBeenCalled();
  });

  it('calls the callback after delay', async () => {
    const callbackSpy = jest.fn();
    const delay = 250;

    const fakeComponent = await mount(
      <FakeComponent callback={callbackSpy} delay={delay} />,
    );

    fakeComponent.find('button').trigger('onClick');

    fakeComponent.act(() => {
      clock.tick(delay);
    });

    expect(callbackSpy).toHaveBeenCalledTimes(1);
  });

  it('calls the callback multiple times after delay if invoked multiple times', async () => {
    const callbackSpy = jest.fn();
    const delay = 400;

    const fakeComponent = await mount(
      <FakeComponent callback={callbackSpy} delay={delay} />,
    );

    fakeComponent.find('button').trigger('onClick');

    fakeComponent.act(() => {
      clock.tick(delay);
    });

    fakeComponent.find('button').trigger('onClick');

    fakeComponent.act(() => {
      clock.tick(delay);
    });

    expect(callbackSpy).toHaveBeenCalledTimes(2);
  });

  it("doesn't call the callback after the delay if the component has unmounted", async () => {
    const callbackSpy = jest.fn();
    const delay = 300;

    const fakeComponent = await mount(
      <FakeComponent callback={callbackSpy} delay={delay} />,
    );

    fakeComponent.find('button').trigger('onClick');

    fakeComponent.unmount();

    fakeComponent.act(() => {
      clock.tick(1.5 * delay);
    });

    expect(callbackSpy).not.toHaveBeenCalled();
  });
});
