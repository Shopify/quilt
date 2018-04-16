import createContext from '../create-mock-context';

const STORE_URL = 'http://mystore.com/admin';

describe('create-mock-context', () => {
  it('includes custom method and url', () => {
    const method = 'PUT';
    const url = STORE_URL;
    const context = createContext({method, url});

    expect(context.method).toBe(method);
    expect(context.url).toBe(url);
  });

  it('sets url segment aliases correctly', () => {
    const context = createContext({url: STORE_URL});

    const {url, originalUrl, host, origin, path, protocol} = context;
    expect(url).toBe(STORE_URL);
    expect(originalUrl).toBe(STORE_URL);
    expect(host).toBe('mystore.com');
    expect(path).toBe('/admin');
    expect(protocol).toBe('http');
    expect(origin).toBe('http://mystore.com');
  });

  it('defaults url segments when no origin is given', () => {
    const context = createContext({url: '/foo'});

    const {url, originalUrl, host, origin, path, protocol} = context;
    expect(url).toBe('http://test.com/foo');
    expect(originalUrl).toBe('http://test.com/foo');
    expect(host).toBe('test.com');
    expect(path).toBe('/foo');
    expect(protocol).toBe('http');
    expect(origin).toBe('http://test.com');
  });

  it('determines protocol based on `encrypted`', () => {
    const context = createContext({
      encrypted: true,
      url: '/foo',
    });

    const {url, originalUrl, origin, path, protocol} = context;
    expect(url).toBe('https://test.com/foo');
    expect(originalUrl).toBe('https://test.com/foo');
    expect(path).toBe('/foo');
    expect(protocol).toBe('https');
    expect(origin).toBe('https://test.com');
  });

  it('includes custom cookies', () => {
    const cookies = {
      test: '1',
    };

    const context = createContext({
      url: STORE_URL,
      cookies,
    });

    expect(context.cookies.requestStore.get('test')).toBe(cookies.test);
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

  it('includes custom state', () => {
    const state = {
      productName: 'Fabulous robot',
    };

    const context = createContext({
      url: STORE_URL,
      state,
    });

    expect(context.state.productName).toBe(context.state.produ);
  });

  it('supports arbitrary custom properties', () => {
    const totallyNotARegularProperty = '👌✨';
    const context = createContext({
      url: STORE_URL,
      totallyNotARegularProperty,
    });

    expect(context.totallyNotARegularProperty).toBe(totallyNotARegularProperty);
  });
});
