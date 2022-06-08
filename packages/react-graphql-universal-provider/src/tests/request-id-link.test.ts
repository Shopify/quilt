import {ApolloLink, Observable} from '@apollo/client';

import {createRequestIdLink} from '../request-id-link';

describe('createRequestIdLink()', () => {
  it('create a link that add request id value to the header', () => {
    const mockRequestId = '06a2f67e-b080-446f-bffa-7851ddad3a45';
    createRequestIdLink(mockRequestId);

    // eslint-disable-next-line no-new
    new ApolloLink((operation) => {
      expect(operation.getContext().header['X-Initiated-By-Request-ID']).toBe(
        mockRequestId,
      );

      return Observable.of({data: {foo: {bar: true}}});
    });
  });
});
