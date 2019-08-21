import querystring from 'querystring';
import {createMockContext} from '@shopify/jest-koa-mocks';

import createEnableCookies from '../create-enable-cookies';

const query = querystring.stringify.bind(querystring);
const baseUrl = 'myapp.com/auth';
const shop = 'shop1.myshopify.io';
const shopOrigin = 'https://shop1.myshopify.io';

const baseConfig = {
  apiKey: 'myapikey',
  secret: '',
};

describe('CreateEnableCookies', () => {
  it('sets body to the enable cookies HTML page', () => {
    const enableCookies = createEnableCookies(baseConfig);
    const ctx = createMockContext({
      url: `https://${baseUrl}?${query({shop})}`,
    });

    enableCookies(ctx);

    expect(ctx.body).toContain('CookiePartitionPrompt');
    expect(ctx.body).toContain(baseConfig.apiKey);
    expect(ctx.body).toContain(shopOrigin);
  });
});
