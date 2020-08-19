import gql from 'graphql-tag';
import withEnv from '@shopify/with-env';

import {createNetworkErrorLink} from '../network-error-link';

import {
  wrapLinkWithContext,
  executeOnce,
  ServerParseErrorLink,
} from './utilities';

const testQuery = gql`
  query Test {
    name
  }
`;

jest.mock('apollo-link-error', () => ({
  ...require.requireActual('apollo-link-error'),
  ErrorLink: jest.fn(),
}));

const createApolloErrorLink = require.requireMock('apollo-link-error')
  .ErrorLink as jest.Mock;

const host = 'something.com';
const apiEndpointPath = '/something/graphql';

describe('createParseErrorLink()', () => {
  const unexpectedHTML =
    "<html><h1>This is some HTML where you don't expect it!</h1><hmtl>";

  beforeEach(() => {
    createApolloErrorLink.mockReset();
    createApolloErrorLink.mockImplementation(
      cb => new ServerParseErrorLink(cb, unexpectedHTML),
    );
  });

  it('creates an error link in development mode', () => {
    withEnv('development', () => {
      executeOnce(
        wrapLinkWithContext(createNetworkErrorLink(), {
          host,
          apiEndpointPath,
        }),
        testQuery,
      );

      expect(createApolloErrorLink).toHaveBeenCalled();
    });
  });

  it('creates a dummy link in production mode', () => {
    withEnv('production', () => {
      executeOnce(
        wrapLinkWithContext(createNetworkErrorLink(), {
          host,
          apiEndpointPath,
        }),
        testQuery,
      ).catch(() => {
        // ignore error thrown by createParseErrorLink because it's a terminating link
      });

      expect(createApolloErrorLink).not.toHaveBeenCalled();
    });
  });

  it('passes along the response body as the error message in development mode', async () => {
    await withEnv('development', async () => {
      const {error} = await executeOnce(
        wrapLinkWithContext(createNetworkErrorLink(), {
          host,
          apiEndpointPath,
        }),
        testQuery,
      );

      expect(error!.message).toStrictEqual(unexpectedHTML);
    });
  });
});
