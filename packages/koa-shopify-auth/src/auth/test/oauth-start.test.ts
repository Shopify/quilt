import {createMockContext} from '@shopify/jest-koa-mocks';
import createOAuthStart from '../create-oauth-start';

const dummyConfig = {
  apiKey: 'myapikey',
  secret: 'mysecret',
  scope: ['write_orders, write_products'],
};
describe('OAuthStart', () => {
  // pending koa mocks being merged
  it('sets body to a redirect page for the given shop', () => {
    const oAuthStart = createOAuthStart(dummyConfig);
    const ctx = createMockContext();

    oAuthStart(ctx);

    expect(ctx.body).toMatchSnapshot();
  });

  it('redirect page includes per-user grant for accessMode: online', async () => {});

  it('throws a 400 when no shop query parameter is given', async () => {});
});
