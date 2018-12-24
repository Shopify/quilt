import {StatusCode, Header} from '@shopify/network';
import {fetch as fetchMock} from '@shopify/jest-dom-mocks';

import {registerWebhook, Options, WebhookHeader} from '..';

const successResponse = {status: StatusCode.Created, body: {foo: 'bar'}};
const failResponse = {status: StatusCode.UnprocessableEntity, body: {}};

describe('registerWebhook', () => {
  afterEach(async () => {
    await fetchMock.flush();
    fetchMock.restore();
  });

  it('sends a post request to the given shop domain with the webhook data in the body and the access token in the headers', async () => {
    fetchMock.mock('*', successResponse);
    const webhook: Options = {
      address: 'myapp.com/webhooks',
      topic: 'app/uninstalled',
      accessToken: 'some token',
      shop: 'shop1.myshopify.io',
    };

    await registerWebhook(webhook);

    const [address, request] = fetchMock.lastCall();
    expect(address).toBe(`https://${webhook.shop}/admin/webhooks.json`);
    expect(request.body).toBe(
      JSON.stringify({
        webhook: {
          topic: webhook.topic,
          address: webhook.address,
          format: 'json',
        },
      }),
    );
    expect(request.headers).toMatchObject({
      [WebhookHeader.AccessToken]: webhook.accessToken,
      [Header.ContentType]: 'application/json',
    });
  });

  it('returns a result with success set to true when the server returns a status of Created', async () => {
    fetchMock.mock('*', successResponse);
    const webhook: Options = {
      address: 'myapp.com/webhooks',
      topic: 'app/uninstalled',
      accessToken: 'some token',
      shop: 'shop1.myshopify.io',
    };

    const result = await registerWebhook(webhook);
    expect(result.success).toBe(true);
  });

  it('returns the parsed response body on result.data', async () => {
    const data = {foo: 'bar', baz: true};
    fetchMock.mock('*', {...successResponse, body: data});
    const webhook: Options = {
      address: 'myapp.com/webhooks',
      topic: 'app/uninstalled',
      accessToken: 'some token',
      shop: 'shop1.myshopify.io',
    };

    const result = await registerWebhook(webhook);
    expect(result.data).toMatchObject(data);
  });

  it('returns a result with success set to true when the server returns a status of Created', async () => {
    fetchMock.mock('*', successResponse);
    const webhook: Options = {
      address: 'myapp.com/webhooks',
      topic: 'app/uninstalled',
      accessToken: 'some token',
      shop: 'shop1.myshopify.io',
    };

    const result = await registerWebhook(webhook);
    expect(result.success).toBe(true);
  });

  it('returns a result with success set to false when the server returns a bad status', async () => {
    fetchMock.mock('*', failResponse);
    const webhook: Options = {
      address: 'myapp.com/webhooks',
      topic: 'app/uninstalled',
      accessToken: 'some token',
      shop: 'shop1.myshopify.io',
    };

    const result = await registerWebhook(webhook);
    expect(result.success).toBe(false);
  });
});
