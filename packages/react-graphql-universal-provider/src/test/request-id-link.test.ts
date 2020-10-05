import {ApolloLink, Observable} from 'apollo-link';

import {createRequestIdLink} from '../request-id-link';

describe('createRequestIdLink()', () => {
  it('create a link that add request id value to the header', () => {
    const mockRequestId = '06a2f67e-b080-446f-bffa-7851ddad3a45';
    const requestIdLink = createRequestIdLink(mockRequestId);

    const mockLink = new ApolloLink(operation => {
      expect(operation.getContext().header['X-Request-ID']).toBe(mockRequestId);

      return Observable.of({data: {foo: {bar: true}}});
    });
  });
});
