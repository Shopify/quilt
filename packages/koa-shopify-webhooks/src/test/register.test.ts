import {Header} from '@shopify/network';
import {fetch as fetchMock} from '@shopify/jest-dom-mocks';

import {ApiVersion, DeliveryMethod} from '../register';

import {registerWebhook, Options, WebhookHeader} from '..';

const successResponse = {
  data: {
    webhookSubscriptionCreate: {
      userErrors: [],
      webhookSubscription: {id: 'gid://shopify/WebhookSubscription/12345'},
    },
  },
};
const failResponse = {data: {}};

describe('registerWebhook', () => {
  afterEach(async () => {
    await fetchMock.flush();
    fetchMock.restore();
  });

  it('sends a post request to the given shop domain with the webhook data as a GraphQL query in the body and the access token in the headers', async () => {
    fetchMock.mock('*', successResponse);
    const webhook: Options = {
      address: 'myapp.com/webhooks',
      topic: 'PRODUCTS_CREATE',
      accessToken: 'some token',
      shop: 'shop1.myshopify.io',
      apiVersion: ApiVersion.Unstable,
    };

    const webhookQuery = `
    mutation webhookSubscriptionCreate {
      webhookSubscriptionCreate(topic: ${webhook.topic}, webhookSubscription: {callbackUrl: "${webhook.address}"}) {
        userErrors {
          field
          message
        }
        webhookSubscription {
          id
        }
      }
    }
  `;

    await registerWebhook(webhook);

    const [address, request] = fetchMock.lastCall();
    expect(address).toBe(
      `https://${webhook.shop}/admin/api/unstable/graphql.json`,
    );
    expect(request.body).toBe(webhookQuery);
    expect(request.headers).toMatchObject({
      [WebhookHeader.AccessToken]: webhook.accessToken,
      [Header.ContentType]: 'application/graphql',
    });
  });

  it('returns a result with success set to true when the server returns a webhookSubscription field', async () => {
    fetchMock.mock('*', successResponse);
    const webhook: Options = {
      address: 'myapp.com/webhooks',
      topic: 'PRODUCTS_CREATE',
      accessToken: 'some token',
      shop: 'shop1.myshopify.io',
    };

    const result = await registerWebhook(webhook);
    expect(result.success).toBe(true);
  });

  it('returns the parsed response body on result.data', async () => {
    fetchMock.mock('*', failResponse);
    const webhook: Options = {
      address: 'myapp.com/webhooks',
      topic: 'PRODUCTS_CREATE',
      accessToken: 'some token',
      shop: 'shop1.myshopify.io',
    };

    const registerResponse = await registerWebhook(webhook);
    expect(registerResponse.result.data).toMatchObject({});
  });

  it('returns a result with success set to false when the server doesn’t return a webhookSubscriptionCreate field', async () => {
    fetchMock.mock('*', failResponse);
    const webhook: Options = {
      address: 'myapp.com/webhooks',
      topic: 'PRODUCTS_CREATE',
      accessToken: 'some token',
      shop: 'shop1.myshopify.io',
    };

    const result = await registerWebhook(webhook);
    expect(result.success).toBe(false);
  });

  it('sends an eventbridge registration GraphQL query for an eventbridge webhook registration', async () => {
    fetchMock.mock('*', successResponse);
    const webhook: Options = {
      address: 'myapp.com/webhooks',
      topic: 'PRODUCTS_CREATE',
      accessToken: 'some token',
      shop: 'shop1.myshopify.io',
      apiVersion: ApiVersion.April20,
      deliveryMethod: DeliveryMethod.EventBridge,
    };

    const webhookQuery = `
    mutation webhookSubscriptionCreate {
      eventBridgeWebhookSubscriptionCreate(topic: ${webhook.topic}, webhookSubscription: {arn: "${webhook.address}"}) {
        userErrors {
          field
          message
        }
        webhookSubscription {
          id
        }
      }
    }
  `;

    await registerWebhook(webhook);

    const [address, request] = fetchMock.lastCall();
    expect(address).toBe(
      `https://${webhook.shop}/admin/api/${ApiVersion.April20}/graphql.json`,
    );
    expect(request.body).toBe(webhookQuery);
    expect(request.headers).toMatchObject({
      [WebhookHeader.AccessToken]: webhook.accessToken,
      [Header.ContentType]: 'application/graphql',
    });
  });
});
