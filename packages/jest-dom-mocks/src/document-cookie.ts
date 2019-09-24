/**
 * @jest-environment jsdom
 */

import cookie from 'cookie';

export default class DocumentCookies {
  private cookies = new Map<string, string>();
  private isUsingMockCookie = false;
  private originalCookie = document.cookie;

  mock(initialCookies: {[key: string]: string} = {}) {
    if (this.isUsingMockCookie) {
      throw new Error(
        'cookie is already mocked, but you tried to mock it again.',
      );
    }

    for (const [key, value] of Object.entries(initialCookies)) {
      this.cookies.set(key, value);
    }

    Object.defineProperty(document, 'cookie', {
      get: () =>
        Array.from(this.cookies.entries()).reduce(
          (accumulator, value, index, array) => {
            const newValue =
              index === array.length - 1
                ? cookie.serialize(value[0], value[1])
                : `${cookie.serialize(value[0], value[1])}; `;

            return `${accumulator}${newValue}`;
          },
          '',
        ),

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

  reset() {
    this.cookies.clear();
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
