import type {Context} from 'koa';

import createContext from '../create-mock-context';

const STORE_URL = '/admin?id=1';
const STORE_HOST = 'mystore.com';

describe('create-mock-context', () => {
  it('includes custom method and url', () => {
    const method = 'PUT';
    const context = createContext({method, url: STORE_URL});

    expect(context.method).toBe(method);
    expect(context.url).toBe(STORE_URL);
  });

  it('defaults status to 404', () => {
    const context = createContext();

    expect(context.status).toBe(404);
  });

  it('includes requestBody on ctx.request', () => {
    const requestBody = 'Hello I am a body';
    const context = createContext({requestBody});

    expect((context.request as any).body).toBe(requestBody);
  });

  it('includes rawBody on ctx.request', () => {
    const rawBody = 'Hello I am a body';
    const context = createContext({rawBody});

    expect((context.request as any).rawBody).toBe(rawBody);
  });

  it('supports setting throw and redirect', () => {
    const throwFn = jest.fn();
    const redirect = jest.fn();

    const context = createContext({throw: throwFn, redirect});

    expect(context.throw).toBe(throwFn);
    expect(context.redirect).toBe(redirect);
  });

  it('defaults throw to a jest fn', () => {
    const context = createContext();
    context.throw();

    expect(context.throw).toHaveBeenCalled();
  });

  it('defaults redirect to a jest fn', () => {
    const context = createContext();
    context.redirect('');

    expect(context.redirect).toHaveBeenCalled();
  });

  it('sets url segment aliases', () => {
    const context = createContext({
      url: STORE_URL,
      host: STORE_HOST,
    });

    const {url, originalUrl, host, origin, path, protocol} = context;
    expect(url).toBe(STORE_URL);
    expect(originalUrl).toBe(STORE_URL);
    expect(path).toBe('/admin');
    expect(protocol).toBe('http');
    expect(host).toBe(STORE_HOST);
    expect(origin).toBe(`http://${STORE_HOST}`);
  });

  it('defaults url segments when no origin is given', () => {
    const context = createContext({url: STORE_URL, host: STORE_HOST});

    const {url, originalUrl, host, origin, path, protocol} = context;
    expect(url).toBe(STORE_URL);
    expect(originalUrl).toBe(STORE_URL);
    expect(path).toBe('/admin');
    expect(host).toBe(STORE_HOST);
    expect(protocol).toBe('http');
    expect(origin).toBe(`http://${STORE_HOST}`);
  });

  it('determines protocol based on `encrypted`', () => {
    const {protocol} = createContext({
      encrypted: true,
      url: '/foo',
    });

    expect(protocol).toBe('https');
  });

  it('includes custom cookies', () => {
    const cookies = {
      test: '1',
    };

    const context = createContext({
      url: STORE_URL,
      cookies,
    });

    expect((context.cookies as any).requestStore.get('test')).toBe(
      cookies.test,
    );
  });

  it('includes custom session data', () => {
    const session = {
      shop: 'shop1',
    };

    const context = createContext({
      url: STORE_URL,
      session,
    });

    expect(context.session.shop).toBe(session.shop);
  });

  it('includes custom headers', () => {
    const headers = {
      referrer: 'shop1',
    };

    const context = createContext({
      url: STORE_URL,
      headers,
    });

    expect(context.headers.referrer).toBe(headers.referrer);
  });

  it('returns custom headers when requested through ctx.get', () => {
    const context = createContext({headers: {test: 'value'}});
    expect(context.get('test')).toBe('value');
  });

  it('sets response headers through ctx.set', () => {
    const context = createContext();
    context.set('test', 'value');
    expect(context.response.headers.test).toBe('value');
  });

  it('includes custom state', () => {
    const state = {
      productName: 'Fabulous robot',
    };

    const context = createContext({
      url: STORE_URL,
      state,
    });

    expect(context.state.productName).toBe(state.productName);
  });

  it('supports arbitrary custom properties', () => {
    const totallyNotARegularProperty = '👌✨';
    const context = createContext({
      url: STORE_URL,
      customProperties: {totallyNotARegularProperty},
    });

    expect(context.totallyNotARegularProperty).toBe(totallyNotARegularProperty);
  });

  it('works in koa middlewares even when passing arbitrary properties', async () => {
    const foo = 'bar';
    const context = createContext({
      url: STORE_URL,
      customProperties: {foo},
    });
    const next = jest.fn();

    await helloWorldMiddleware(context, next);

    expect(next).toHaveBeenCalled();
    expect(context.body).toBe('hello world');
    expect(context.foo).toBe(foo);
  });
});

function helloWorldMiddleware(ctx: Context, next: Function) {
  ctx.body = 'hello world';
  return next();
}
