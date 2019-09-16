export default class Cookie {
  mock(value: string) {
    Reflect.defineProperty(window.document, 'cookie', {
      writable: true,
      value,
    });
  }
}
