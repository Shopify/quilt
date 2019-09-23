import {createMockContext} from '@shopify/jest-koa-mocks';
import {applyCookieToContext} from '../server';

describe('server', () => {
  it('applies a simple cookie to context', () => {
    const cookies = {foo: {value: 'bar'}};
    const context = createMockContext();

    applyCookieToContext(cookies)(context);

    expect(context.cookies.set).toHaveBeenCalledWith('foo', 'bar', {});
  });

  it('applies multiple cookies to context with options when they exist', () => {
    const options = {
      path: '/',
      domain: 'test.com',
      id: '1234',
      expires: new Date(),
      httpOnly: true,
      secure: true,
      sameSite: 'strict' as 'strict',
      maxAge: 1,
    };
    const cookies = {foo: {value: 'bar'}, baz: {value: 'qux', ...options}};
    const context = createMockContext();

    applyCookieToContext(cookies)(context);

    expect(context.cookies.set).toHaveBeenCalledWith('foo', 'bar', {});
    expect(context.cookies.set).toHaveBeenCalledWith('baz', 'qux', options);
  });
});
