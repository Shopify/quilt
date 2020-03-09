import {createMockContext} from '@shopify/jest-koa-mocks';

import getCookieOptions from '../cookie-options';

describe('Get cookie options', () => {
  it('can give samesite and secure options for chrome', () => {
    const ctx = createMockContext({
      headers: {
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.77 Safari/537.36',
      },
    });
    const options = getCookieOptions(ctx);
    expect(options).toStrictEqual({
      sameSite: 'none',
      secure: true,
    });
  });
  it('can be without setting samesite and secure options for now chrome browsers', () => {
    const ctx = createMockContext({
      headers: {
        'user-agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0 Safari/605.1.15',
      },
    });
    const options = getCookieOptions(ctx);
    expect(options).toStrictEqual({});
  });
});
