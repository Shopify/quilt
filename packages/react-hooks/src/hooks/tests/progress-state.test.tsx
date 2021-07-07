import React from 'react';
import {mount} from '@shopify/react-testing';

import {useAsyncActionState} from '../progress-state';

describe('useAsyncActionState', () => {
  function MockComponent({method = () => Promise.resolve()}: any) {
    const [value, handler] = useAsyncActionState(method);
    const props = {value, handler};

    return <Placeholder {...props} />;
  }

  const Placeholder = (_props: any) => null;

  it('sets the initial progress to false', () => {
    const wrapper = mount(<MockComponent />);

    expect(wrapper).toContainReactComponent(Placeholder, {value: false});
  });

  it('sets progress to true when the handler is called', async () => {
    const wrapper = mount(<MockComponent />);

    const handlerPromise = wrapper.find(Placeholder)!.trigger('handler');

    expect(wrapper).toContainReactComponent(Placeholder, {value: true});

    await handlerPromise;
  });

  it('resets progress to false when the handler resolves', async () => {
    const wrapper = mount(<MockComponent />);

    await wrapper.find(Placeholder)!.trigger('handler');

    expect(wrapper).toContainReactComponent(Placeholder, {value: false});
  });

  it('resets progress if the handler throws an error', async () => {
    const wrapper = mount(
      <MockComponent
        method={() => {
          throw new Error('test');
        }}
      />,
    );

    await expect(wrapper.find(Placeholder)!.trigger('handler')).rejects.toThrow(
      'test',
    );

    expect(wrapper).toContainReactComponent(Placeholder, {value: false});
  });
});
