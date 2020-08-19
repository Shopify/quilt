import gql from 'graphql-tag';
import {GraphQLError} from 'graphql';
import {StatusCode} from '@shopify/network';

import {createErrorHandlerLink} from '../error-link';

import {executeOnce, NetworkErrorLink} from './utilities';

const testQuery = gql`
  query Test {
    name
  }
`;

describe('createErrorHandlerLink()', () => {
  it('calls the next link with a formatted GraphQL error response when the response has an error status', async () => {
    const link = createErrorHandlerLink();
    const response = new Response('', {status: StatusCode.Forbidden});
    const errorLink = new NetworkErrorLink(response);
    const {result} = await executeOnce(link.concat(errorLink), testQuery);

    expect(result).toHaveProperty('errors');
    expect(result!.errors![0]).toBeInstanceOf(GraphQLError);
  });

  it('surfaces the response’s status code in the GraphQLError message', async () => {
    const statusCode = StatusCode.InternalServerError;
    const link = createErrorHandlerLink();
    const response = new Response('', {status: statusCode});
    const errorLink = new NetworkErrorLink(response);
    const {result} = await executeOnce(link.concat(errorLink), testQuery);

    expect(result!.errors![0].message).toContain(`${statusCode}`);
  });
});
