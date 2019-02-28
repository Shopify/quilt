import {Method, StatusCode, Header} from '@shopify/network';
import {WebhookHeader, Topic} from './types';

export interface Options {
  topic: Topic;
  address: string;
  shop: string;
  accessToken: string;
}

export async function registerWebhook({
  address,
  topic,
  accessToken,
  shop,
}: Options) {
  const response = await fetch(`https://${shop}/admin/api/graphql.json`, {
    method: Method.Post,
    body: buildQuery(topic, address),
    headers: {
      [WebhookHeader.AccessToken]: accessToken,
      [Header.ContentType]: 'application/graphql',
    },
  });

  const data = await response.json();

  if (
    response.status === StatusCode.Created ||
    response.status === StatusCode.Ok
  ) {
    return {success: true, data};
  } else {
    return {success: false, data};
  }
}

function buildQuery(topic: string, callbackUrl: string) {
  return `
    mutation webhookSubscriptionCreate {
      webhookSubscriptionCreate(topic: ${topic}, webhookSubscription: {callbackUrl: "${callbackUrl}"}) {
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
}
