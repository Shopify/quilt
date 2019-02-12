import {ApolloLink} from 'apollo-link';
import {executeOnce, SimpleLink} from './utilities/apollo-link';

import MemoryApolloLink from '../MemoryApolloLink';
import petQuery from './fixtures/PetQuery.graphql';
import {MockRequest} from '../types';

describe('MemoryApolloLink', () => {
  it('throw error when MemoryApolloLink are being executed as a terminating link', () => {
    const mockApolloLink = new MemoryApolloLink();

    expect(executeOnce(mockApolloLink, petQuery)).rejects.toEqual(
      'The memory link must not be a terminating link',
    );
  });

  it('calls requestCreated once when query executed', () => {
    const requestCreated = jest.fn();
    const memoryApolloLink = new MemoryApolloLink();
    memoryApolloLink.onRequestCreated(requestCreated);

    executeOnce(
      ApolloLink.from([memoryApolloLink, new SimpleLink()]),
      petQuery,
    );

    expect(requestCreated).toHaveBeenCalledTimes(1);
    expect(requestCreated).toHaveBeenCalledWith(
      expect.objectContaining({
        operation: expect.objectContaining({operationName: 'Pet'}),
        resolve: expect.any(Function),
      }),
    );
  });

  it('calls requestResolved when the request resolved', async () => {
    const requests: MockRequest[] = [];
    const requestResolved = jest.fn();
    const memoryApolloLink = new MemoryApolloLink();
    memoryApolloLink.onRequestCreated(request => {
      requests.push(request);
    });
    memoryApolloLink.onRequestResolved(requestResolved);

    executeOnce(
      ApolloLink.from([memoryApolloLink, new SimpleLink()]),
      petQuery,
    );

    await Promise.all(requests.map(({resolve}) => resolve()));

    expect(requestResolved).toHaveBeenCalledTimes(1);
    expect(requestResolved).toHaveBeenCalledWith(
      expect.objectContaining({
        operation: expect.objectContaining({operationName: 'Pet'}),
        resolve: expect.any(Function),
      }),
    );
  });
});
