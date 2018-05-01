# `@shopify/jest-koa-mocks`

## Installation

```bash
$ yarn add @shopify/jest-koa-mocks
```

## Usage

### createMockContext

This function allows you to create fully stubbable koa contexts for your tests. Using this you can test middleware without actually having to setup an app or http mocks in your tests.

```typescript
  export interface Options<
    CustomProperties extends Object,
    RequestBody = undefined
  > {
    url?: string;
    method?: RequestMethod;
    statusCode?: number;
    session?: Dictionary<any>;
    headers?: Dictionary<string>;
    cookies?: Dictionary<string>;
    state?: Dictionary<any>;
    encrypted?: boolean;
    host?: string;
    requestBody?: RequestBody;
    throw?: Function;
    redirect?: Function;
    customProperties?: CustomProperties;
  }

  createContext(options: Options)
```

#### simple example

In the simplest case you call `createMockContext`, run your middleware passing the result in, and then assert against the context objects fields

```typescript
import SillyViewCounterMiddleware from '../silly-view-counter';
import {createMockContext} from '@shopify/jest-koa-mocks';

describe('silly-view-counter', () => {
  it('iterates and displays new ctx.state.views', async () => {
    const ctx = createMockContext({state: {views: 31}});

    await SillyViewCounterMiddleware(ctx);

    expect(ctx.state.views).toBe(32);
    expect(ctx.status).toBe(200);
    expect(ctx.body).toBe({view: 32});
  });
});
```

#### testing throws and redirects

`ctx.throw` and `ctx.redirect` are defaulted to `jest.fn()`s, allowing you to easily test that a request has redirected or thrown in your middleware.

```typescript
import passwordValidator from '../password-validator';
import {createMockContext} from '@shopify/jest-koa-mocks';

describe('password-validator', () => {
  it('throws if no password query parameter is present', async () => {
    const ctx = createMockContext({url: '/validate'});

    await passwordValidator(ctx);

    expect(ctx.throw).toBeCalledWith(400);
  });

  it('redirects to /user if the password is correct', async () => {
    const ctx = createMockContext({url: '/validate?password=correct'});

    await passwordValidator(ctx);

    expect(ctx.redirect).toBeCalledWith('/user');
  });
});
```

#### testing cookies

`ctx.cookies` is created using `createMockCookies`.

```typescript
import oAuthStart from '../';
import {createMockContext} from '@shopify/jest-koa-mocks';

describe('oauthStart', () => {
  it('sets nonce cookie', () => {
    const oAuthStart = createOAuthStart(baseConfig);
    const ctx = createMockContext({
      url: `https://myCoolApp.com/auth`,
    });

    oAuthStart(ctx);

    expect(ctx.cookies.set).toBeCalledWith('shopifyNonce', fakeNonce);
  });
});
```

#### testing apps using common koa libraries

`createContext` allows you to pass a `body` and `session` key by default, so you should be able to test applications using the common body parsing or session libraries simply and quickly.

```javascript
import login from '../login';
import {createMockContext} from '@shopify/jest-koa-mocks';

describe('password-validator', () => {
  it('sets session.user if body contains a valid password and username', async () => {
    const ctx = createMockContext({
      url: '/login',
      body: {
        username: 'valid',
        password: 'valid',
      },
      session: {},
    });

    await login(ctx);

    expect(ctx.session.user).toMatchObject({
      username: 'valid',
      accessToken: 'dummy-access-token',
    });
  });
});
```

### createMockCookies

Creates a mock cookies instance.

```javascript
const cookies = createMockCookies({
  sessionID: 'something something',
  store: 'shop1',
  referrer: 'somewhere.io',
});
```

The returned object will have the signature

```typescript
interface MockCookies {
  set(key: string, value: string): void;
  get(key: string): string;
  responseStore: Map<string, string>;
  requestStore: Map<string, string>;
}
```

The `set` and `get` functions are designed to mimic how actual koa cookie instances work. This means `set` will set a value to the `responseStore`, while `get` will retrieve values from the `requestStore`.

```javascript
// will set to the response store
cookies.set('key', 'value');

// will get from the request store
cookies.get('key') !== 'value';
// => true
```

When testing against a mock cokies instance you can either assert against the `set`/`get` functions, or you can check if the appropriate value is in the expected store.

```javascript
cookies.set('foo', 'bar');
expect(cookies.set).toBeCalledWith('foo', 'bar');
```

```javascript
cookies.set('foo', 'bar');
expect(cookies.responseStore.get('foo')).toBe('bar');
```
