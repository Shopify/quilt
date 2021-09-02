import {Method, Header} from '@shopify/network';

import {WebhookHeader, Topic} from './types';

export type ApiVersion =
  | '2020-10'
  | '2021-01'
  | '2021-04'
  | '2021-07'
  | 'unstable'
  | 'unversioned'
  | (string & {});

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
  includeFields?: Array<string>;
  deliveryMethod?: DeliveryMethod;
}

export async function registerWebhook({
  address,
  topic,
  accessToken,
  shop,
  apiVersion,
  includeFields = [],
  deliveryMethod = DeliveryMethod.Http,
}: Options) {
  const response = await fetch(
    `https://${shop}/admin/api/${apiVersion}/graphql.json`,
    {
      method: Method.Post,
      body: buildQuery(topic, address, deliveryMethod, includeFields),
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
  includeFields: Array<string>
) {
  let mutationName;
  let webhookSubscriptionArgs;
  switch (deliveryMethod) {
    case DeliveryMethod.Http:
      mutationName = 'webhookSubscriptionCreate';
      webhookSubscriptionArgs = `{callbackUrl: "${address}" , includeFields: ${JSON.stringify(includeFields)}}`;
      break;
    case DeliveryMethod.EventBridge:
      mutationName = 'eventBridgeWebhookSubscriptionCreate';
      webhookSubscriptionArgs = `{arn: "${address}" , includeFields: ${JSON.stringify(includeFields)}}`;
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
