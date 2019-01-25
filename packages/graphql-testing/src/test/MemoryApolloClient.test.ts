import {InMemoryCache} from 'apollo-cache-inmemory';
import {SimpleLink} from './utilities/apollo-link';

import MemoryApolloClient from '../MemoryApolloClient';
import petQuery from './fixtures/PetQuery.graphql';

describe('MemoryApolloClient', () => {
  it('adds query to request when executed', () => {
    const mockOptions = {link: new SimpleLink(), cache: new InMemoryCache()};
    const memoryApolloClient = new MemoryApolloClient(mockOptions);

    expect(memoryApolloClient.operations.all()).toHaveLength(0);
    memoryApolloClient.query({query: petQuery});
    expect(memoryApolloClient.operations.all()).toHaveLength(1);
  });

  it('resolve all pendingRequests when resolveAll was called', () => {
    const mockOptions = {link: new SimpleLink(), cache: new InMemoryCache()};
    const memoryApolloClient = new MemoryApolloClient(mockOptions);

    memoryApolloClient.query({query: petQuery});
    expect(Array.from(memoryApolloClient.pendingRequests)).toHaveLength(1);
    memoryApolloClient.resolveAll();
    expect(Array.from(memoryApolloClient.pendingRequests)[0]).resolves;
  });

  it('delete request from pendingRequests when resolved', () => {
    const mockOptions = {link: new SimpleLink(), cache: new InMemoryCache()};
    const memoryApolloClient = new MemoryApolloClient(mockOptions);

    memoryApolloClient.query({query: petQuery});
    expect(Array.from(memoryApolloClient.pendingRequests)).toHaveLength(1);
    memoryApolloClient.resolveAll();
    expect(Array.from(memoryApolloClient.pendingRequests)).toHaveLength(0);
  });
});
