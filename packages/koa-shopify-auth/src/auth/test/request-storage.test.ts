import querystring from 'querystring';
import {createMockContext} from '@shopify/jest-koa-mocks';

import createRequestStorage from '../create-request-storage';
import {readTemplate} from '../itp-template';

const query = querystring.stringify.bind(querystring);
const baseUrl = 'myapp.com/auth';
const shop = 'shop1.myshopify.io';
const shopOrigin = 'https://shop1.myshopify.io';
const apiKey = 'myapikey';

describe('CreateTopLevelCookie', () => {
  it('sets body to the enable cookies HTML page', () => {
    const requestStorage = createRequestStorage();
    const ctx = createMockContext({
      url: `https://${baseUrl}?${query({shop})}`,
    });

    ctx.state = {
      authRoute: baseUrl,
      apiKey,
    };

    requestStorage(ctx);

    expect(ctx.body).toContain('needs access to cookies');
    expect(ctx.body).toContain(apiKey);
    expect(ctx.body).toContain(shopOrigin);
    expect(ctx.body).toContain(readTemplate('request-storage.js'));
  });
});
