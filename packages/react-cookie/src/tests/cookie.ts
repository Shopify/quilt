export default class Cookie {
  mock(value: string) {
    Reflect.defineProperty(window.document, 'cookie', {
      writable: true,
      value,
    });
  }

  restore() {
    Reflect.defineProperty(window.document, 'cookie', {
      writable: true,
      value: null,
    });
  }
}
