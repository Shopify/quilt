import {Method, Header} from '@shopify/network';
import {WebhookHeader, Topic} from './types';

export enum ApiVersion {
  April19 = '2019-04',
  July19 = '2019-07',
  Unstable = 'unstable',
  Unversioned = 'unversioned',
}

export interface Options {
  topic: Topic;
  address: string;
  shop: string;
  accessToken: string;
  apiVersion: ApiVersion;
}

export async function registerWebhook({
  address,
  topic,
  accessToken,
  shop,
  apiVersion,
}: Options) {
  const response = await fetch(
    `https://${shop}/admin/api/${apiVersion}/graphql.json`,
    {
      method: Method.Post,
      body: buildQuery(topic, address),
      headers: {
        [WebhookHeader.AccessToken]: accessToken,
        [Header.ContentType]: 'application/graphql',
      },
    },
  );

  const result = await response.json();

  if (
    result.data &&
    result.data.webhookSubscriptionCreate &&
    result.data.webhookSubscriptionCreate.webhookSubscription
  ) {
    return {success: true, result};
  } else {
    return {success: false, result};
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
