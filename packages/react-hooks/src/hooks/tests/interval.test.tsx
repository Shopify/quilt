import * as React from 'react';
import {mount} from '@shopify/react-testing';
import {clock} from '@shopify/jest-dom-mocks';
import useInterval from '../interval';
import {act} from 'react-dom/test-utils';

describe('useInterval', () => {
  const mockDefaultProps = {
    delay: 1000,
    startImmediatly: false,
    spy: () => {},
  };

  function MockComponent({
    startImmediatly,
    delay,
    spy,
    ...props
  }: {
    startImmediatly?: boolean;
    delay: number;
    spy: () => void;
    start?: boolean;
    stop?: boolean;
  }) {
    const {start, stop} = useInterval(spy, delay, startImmediatly);

    React.useEffect(
      () => {
        if (props.start) {
          start();
        }
      },
      [props.start],
    );

    React.useEffect(
      () => {
        if (props.stop) {
          stop();
        }
      },
      [props.stop],
    );

    return null;
  }

  beforeEach(() => {
    clock.mock();
  });

  afterEach(() => {
    clock.restore();
  });

  it('does not call the handler immediately', () => {
    const spy = jest.fn();
    const delay = 1000;

    mount(<MockComponent {...mockDefaultProps} spy={spy} delay={delay} />);

    act(() => {
      clock.tick(delay);
    });

    expect(spy).not.toHaveBeenCalled();
  });

  it('starts calling the handler immediately when startImmediatly is true', () => {
    const spy = jest.fn();
    const delay = 1000;

    mount(
      <MockComponent
        {...mockDefaultProps}
        spy={spy}
        delay={delay}
        startImmediatly
      />,
    );

    act(() => {
      clock.tick(delay);
    });

    expect(spy).toHaveBeenCalled();
  });

  it('starts calling the handler immediately when the returned start() function is called', () => {
    const spy = jest.fn();
    const delay = 1000;

    const wrapper = mount(
      <MockComponent
        {...mockDefaultProps}
        delay={delay}
        spy={spy}
        startImmediatly={false}
      />,
    );

    act(() => {
      clock.tick(delay);
    });

    expect(spy).not.toHaveBeenCalled();

    wrapper.setProps({start: true});

    act(() => {
      clock.tick(delay);
    });

    expect(spy).toHaveBeenCalled();
  });

  it('stops calling the handler immediately when the returned stop() function is called', () => {
    const spy = jest.fn();
    const delay = 1000;

    const wrapper = mount(
      <MockComponent
        {...mockDefaultProps}
        delay={delay}
        spy={spy}
        startImmediatly={true}
      />,
    );

    wrapper.setProps({stop: true});

    act(() => {
      clock.tick(delay * 3);
    });

    expect(spy).toHaveBeenCalledTimes(0);
  });
});
