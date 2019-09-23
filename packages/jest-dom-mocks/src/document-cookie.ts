/**
 * @jest-environment jsdom
 */

import cookie from 'cookie';

export default class DocumentCookies {
  private cookies = new Map<string, string>();
  private isUsingMockCookie = false;
  private originalCookie = document.cookie;

  mock() {
    if (this.isUsingMockCookie) {
      throw new Error(
        'cookie is already mocked, but you tried to mock it again.',
      );
    }

    Object.defineProperty(document, 'cookie', {
      get: () =>
        Array.from(this.cookies.entries()).reduce((accumulator, value) => {
          return `${accumulator}${cookie.serialize(value[0], value[1])};`;
        }, ''),

      set: (...args) => {
        Object.entries(cookie.parse(args[0])).forEach(
          ([key, value]: [string, string]) => {
            this.cookies.set(key, value);
          },
        );
      },
      configurable: true,
    });

    this.isUsingMockCookie = true;
  }

  restore() {
    if (!this.isUsingMockCookie) {
      throw new Error('cookie is already real, but you tried to restore it.');
    }

    Reflect.defineProperty(window.document, 'cookie', {
      writable: true,
      value: this.originalCookie,
    });

    this.isUsingMockCookie = false;
  }

  isMocked() {
    return this.isUsingMockCookie;
  }
}
