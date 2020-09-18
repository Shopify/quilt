import {Method, Header} from '@shopify/network';

import {WebhookHeader, Topic} from './types';

export enum ApiVersion {
  April19 = '2019-04',
  July19 = '2019-07',
  October19 = '2019-10',
  January20 = '2020-01',
  April20 = '2020-04',
  Unstable = 'unstable',
  Unversioned = 'unversioned',
}

export enum DeliveryMethod {
  Http = 'http',
  EventBridge = 'eventbridge',
}

export interface Options {
  topic: Topic;
  address: string;
  shop: string;
  accessToken: string;
  apiVersion: ApiVersion;
  deliveryMethod: DeliveryMethod;
}

export async function registerWebhook({
  address,
  topic,
  accessToken,
  shop,
  apiVersion,
  deliveryMethod = DeliveryMethod.Http,
}: Options) {
  const response = await fetch(
    `https://${shop}/admin/api/${apiVersion}/graphql.json`,
    {
      method: Method.Post,
      body: buildQuery(topic, address, deliveryMethod),
      headers: {
        [WebhookHeader.AccessToken]: accessToken,
        [Header.ContentType]: 'application/graphql',
      },
    },
  );

  const result = await response.json();

  return {success: isSuccess(result, deliveryMethod), result};
}

function isSuccess(result, deliveryMethod: DeliveryMethod): boolean {
  switch (deliveryMethod) {
    case DeliveryMethod.Http:
      return Boolean(
        result.data &&
          result.data.webhookSubscriptionCreate &&
          result.data.webhookSubscriptionCreate.webhookSubscription,
      );
    case DeliveryMethod.EventBridge:
      return Boolean(
        result.data &&
          result.data.eventBridgeWebhookSubscriptionCreate &&
          result.data.eventBridgeWebhookSubscriptionCreate.webhookSubscription,
      );
  }
}

function buildQuery(
  topic: string,
  address: string,
  deliveryMethod: DeliveryMethod,
) {
  let mutationName;
  let webhookSubscriptionArgs;
  switch (deliveryMethod) {
    case DeliveryMethod.Http:
      mutationName = 'webhookSubscriptionCreate';
      webhookSubscriptionArgs = `{callbackUrl: "${address}"}`;
      break;
    case DeliveryMethod.EventBridge:
      mutationName = 'eventBridgeWebhookSubscriptionCreate';
      webhookSubscriptionArgs = `{arn: "${address}"}`;
      break;
  }
  return `
    mutation webhookSubscriptionCreate {
      ${mutationName}(topic: ${topic}, webhookSubscription: ${webhookSubscriptionArgs}) {
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
