import {GraphQLError} from 'graphql';
import faker from 'faker';
import {noop} from '@shopify/javascript-utilities/other';
import {
  executeOnce,
  SimpleHttpLink,
  SimpleLink,
  NetworkErrorLink,
  GraphQLErrorLink,
} from '@shopify/apollo-link-test-utilities';
import {StatusCode} from '@shopify/network';
import {clock} from '@shopify/jest-dom-mocks';

import {createOperationDetailsLink, Options} from '../operations-details-link';

import testQuery from './fixtures/TestQuery.graphql';

const AppHeaderID = 'X-Request-ID';

jest.mock('@shopify/performance', () => ({
  ...jest.requireActual('@shopify/performance'),
  now: () => Date.now(),
}));

const defaultOptions: Options = {
  onOperation: noop,
};

describe('createOperationDetailsLink()', () => {
  beforeEach(() => {
    clock.mock();
  });

  afterEach(() => {
    clock.restore();
  });

  describe('onOperation()', () => {
    it('is called with basic details about the operation', async () => {
      const spy = jest.fn();
      const operationName = 'Test';
      const link = createOperationDetailsLink({
        ...defaultOptions,
        onOperation: spy,
      });

      await executeOnce(link.concat(new SimpleLink()), testQuery);

      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({name: operationName, success: true}),
      );
    });

    it('is called with no status code when no HTTP response exists from a subsequent link', async () => {
      const spy = jest.fn();
      const link = createOperationDetailsLink({
        ...defaultOptions,
        onOperation: spy,
      });

      await executeOnce(link.concat(new SimpleLink()), testQuery);

      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({status: undefined}),
      );
    });

    it('is called with no URL when no HTTP response exists from a subsequent link', async () => {
      const spy = jest.fn();
      const link = createOperationDetailsLink({
        ...defaultOptions,
        onOperation: spy,
      });

      await executeOnce(link.concat(new SimpleLink()), testQuery);

      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({url: undefined}),
      );
    });

    it('is called with no request ID when no HTTP response exists from a subsequent link', async () => {
      const spy = jest.fn();
      const link = createOperationDetailsLink({
        ...defaultOptions,
        onOperation: spy,
      });

      await executeOnce(link.concat(new SimpleLink()), testQuery);

      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({requestId: undefined}),
      );
    });

    it('is called with the status code of the HTTP request from a subsequent link', async () => {
      const spy = jest.fn();
      const link = createOperationDetailsLink({
        ...defaultOptions,
        onOperation: spy,
      });

      const status = StatusCode.Unauthorized;

      await executeOnce(
        link.concat(new SimpleHttpLink(new Response('', {status}))),
        testQuery,
      );

      expect(spy).toHaveBeenCalledWith(expect.objectContaining({status}));
    });

    it('is called with the URL of the HTTP request from a subsequent link', async () => {
      const spy = jest.fn();
      const url = 'https://snowdevil.myshopify.com/admin/api/graphql';
      const link = createOperationDetailsLink({
        ...defaultOptions,
        onOperation: spy,
      });

      const response = new Response('');
      Reflect.defineProperty(response, 'url', {value: url});

      await executeOnce(link.concat(new SimpleHttpLink(response)), testQuery);

      expect(spy).toHaveBeenCalledWith(expect.objectContaining({url}));
    });

    it('is called with the request ID of the HTTP request from a subsequent link', async () => {
      const spy = jest.fn();
      const link = createOperationDetailsLink({
        ...defaultOptions,
        requestIdHeader: AppHeaderID,
        onOperation: spy,
      });

      const requestId = faker.random.uuid();
      const headers = {[AppHeaderID]: requestId};

      await executeOnce(
        link.concat(new SimpleHttpLink(new Response('', {headers}))),
        testQuery,
      );

      expect(spy).toHaveBeenCalledWith(expect.objectContaining({requestId}));
    });

    it('is called with the duration and time range of the operation', async () => {
      const start = new Date(2018, 0, 1, 0, 0, 0, 0).getTime();
      const end = new Date(2018, 0, 1, 0, 0, 0, 123).getTime();
      clock.setTime(start);

      const spy = jest.fn();
      const link = createOperationDetailsLink({
        ...defaultOptions,
        onOperation: spy,
      });

      const timeTickingLink = new SimpleLink(undefined, () => {
        clock.setTime(end);
        return {};
      });

      await executeOnce(link.concat(timeTickingLink), testQuery);

      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          start,
          end,
          duration: end - start,
        }),
      );
    });

    it('is called with GraphQL errors when they are present in a result', async () => {
      const spy = jest.fn();
      const message = 'Something bad happened';
      const path = ['foo', 'bar', 2, 'baz'];
      const link = createOperationDetailsLink({
        ...defaultOptions,
        onOperation: spy,
      });

      await executeOnce(
        link.concat(
          new GraphQLErrorLink(
            new GraphQLError(message, undefined, undefined, undefined, path),
          ),
        ),
        testQuery,
      );

      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          errors: [{message, path: path.join(',')}],
        }),
      );
    });

    it('is called with failed operations', async () => {
      const spy = jest.fn();
      const operationName = 'Test';
      const link = createOperationDetailsLink({
        ...defaultOptions,
        onOperation: spy,
      });

      await executeOnce(link.concat(new NetworkErrorLink()), testQuery);

      expect(spy).toHaveBeenCalledWith(
        expect.objectContaining({name: operationName, success: false}),
      );
    });
  });
});
