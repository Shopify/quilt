import React, {ReactNode} from 'react';
import {mount} from '@shopify/react-testing';

import {useWorker} from '../index';

jest.mock('@shopify/web-worker', () => ({
  terminate: jest.fn(),
}));

const {terminate} = jest.requireMock('@shopify/web-worker');

describe('useWorker()', () => {
  beforeEach(() => {
    terminate.mockRestore();
  });

  it('creates a worker using a worker module', () => {
    const workerModule = {};
    const createWorker = jest.fn(() => workerModule);
    const spy = jest.fn();

    mount(<MockComponent create={createWorker}>{spy}</MockComponent>);

    expect(createWorker).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(workerModule);
  });

  it('terminates a worker on unmount', () => {
    const workerModule = {};
    mount(<MockComponent create={() => workerModule} />).unmount();
    expect(terminate).toHaveBeenCalledWith(workerModule);
  });
});

interface Props {
  create(): {};
  children?(worker: any): ReactNode;
}

function MockComponent({create = mockCreate(), children}: Props) {
  const worker = useWorker(create);
  return <>{children && children(worker)}</>;
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
