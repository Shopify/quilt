import createContext from '../create-mock-context';

describe('create-mock-context', () => {
  it('includes custom method and url', () => {
    const method = 'PUT';
    const url = 'http://mystore.com/admin';
    const context = createContext({method, url});

    expect(context.method).toBe(method);
    expect(context.url).toBe(url);
  });

  it('includes custom cookies', () => {
    const cookies = {
      test: '1',
    };

    const context = createContext({cookies});

    expect(context.cookies.requestStore.get('test')).toBe(cookies.test);
  });

  it('includes custom session data', () => {
    const session = {
      shop: 'shop1',
    };
    const context = createContext({session});

    expect(context.session.shop).toBe(session.shop);
  });

  it('includes custom headers', () => {
    const headers = {
      referrer: 'shop1',
    };

    const context = createContext({
      headers,
    });

    expect(context.headers.referrer).toBe(headers.referrer);
  });

  it('includes custom state', () => {
    const state = {
      productName: 'Fabulous robot',
    };

    const context = createContext({
      state,
    });

    expect(context.state.productName).toBe(context.state.produ);
  });

  it('supports arbitrary custom properties', () => {
    const totallyNotARegularProperty = '👌✨';
    const context = createContext({totallyNotARegularProperty});

    expect(context.totallyNotARegularProperty).toBe(totallyNotARegularProperty);
  });
});
