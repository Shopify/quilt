import React from 'react';
import {mount} from '@shopify/react-testing';

import {useLazyRef} from '../lazy-ref';

describe('useLazyRef()', () => {
  it('calls the passed function and returns the ref for it', () => {
    const content = 'Hello world';
    const spy = jest.fn(() => content);

    function MockComponent() {
      const value = useLazyRef(spy);
      return <div>{value.current}</div>;
    }

    const mockComponent = mount(<MockComponent />);

    expect(spy).toHaveBeenCalled();
    expect(mockComponent).toContainReactText(content);
  });

  it('does not call the passed function on subsequent renders', () => {
    function MockComponent({spy}: {spy: () => any}) {
      const value = useLazyRef(spy);
      return <div>{value.current}</div>;
    }

    const mockComponent = mount(<MockComponent spy={() => 'Hello'} />);

    const newContent = 'Goodbye';
    const spy = jest.fn(() => newContent);
    mockComponent.setProps({spy});

    expect(spy).not.toHaveBeenCalled();
    expect(mockComponent).not.toContainReactText(newContent);
  });
});
