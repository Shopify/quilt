import querystring from 'querystring';
import {createMockContext} from '@shopify/jest-koa-mocks';

import createTopLevelCookie from '../create-top-level-cookie';
import {readTemplate} from '../itp-template';

const query = querystring.stringify.bind(querystring);
const baseUrl = 'myapp.com/auth';
const shop = 'shop1.myshopify.io';
const shopOrigin = 'https://shop1.myshopify.io';
const apiKey = 'myapikey';
const appName = 'test app';

describe('CreateRequestStorage', () => {
  it('sets body to the enable cookies HTML page', () => {
    const topLevelCookie = createTopLevelCookie();
    const ctx = createMockContext({
      url: `https://${baseUrl}?${query({shop})}`,
    });

    ctx.state = {
      authRoute: baseUrl,
      apiKey,
      appName,
    };

    topLevelCookie(ctx);

    expect(ctx.body).toContain('Your browser needs to authenticate test app');
    expect(ctx.body).toContain(apiKey);
    expect(ctx.body).toContain(shopOrigin);
    expect(ctx.body).toContain(readTemplate('top-level.js'));
  });
});
