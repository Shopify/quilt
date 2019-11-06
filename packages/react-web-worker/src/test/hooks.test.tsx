import React from 'react';
import {mount} from '@shopify/react-testing';

import {useWorker} from '../index';

interface Props {
  create(): {};
  children: (worker) => React.ReactNode | jest.Mock;
}

function mockCreate() {
  return () => {
    return {
      hello(friend: string) {
        return `Hello, ${friend}`;
      },
    };
  };
}
describe('useWorker', () => {
  function MockComponent({create = mockCreate(), children}: Props) {
    const worker = useWorker(create);
    return <>{children(worker)}</>;
  }

  it('creates a worker using a worker module', () => {
    const workerModule = {};
    const spy = jest.fn();
    const createWorker = jest.fn(() => workerModule);

    mount(<MockComponent create={createWorker}>{spy}</MockComponent>);

    expect(createWorker).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(workerModule);
  });

  it.todo('terminates a worker');
});
