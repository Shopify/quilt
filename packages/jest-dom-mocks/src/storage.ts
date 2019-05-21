export default class Storage {
  getItem = jest.fn<string | null>(this.unmockedGetItem);

  setItem = jest.fn<undefined>(this.unmockedSetItem);

  removeItem = jest.fn<undefined>(this.unmockedRemoveItem);

  clear = jest.fn<undefined>(this.unmockedClearItem);

  private store: {
    [key: string]: string;
  } = Object.create(null);

  restore() {
    this.getItem.mockClear();
    this.getItem.mockImplementation(this.unmockedGetItem);

    this.setItem.mockClear();
    this.setItem.mockImplementation(this.unmockedSetItem);

    this.removeItem.mockClear();
    this.removeItem.mockImplementation(this.unmockedRemoveItem);

    this.clear.mockClear();
    this.clear.mockImplementation(this.unmockedClearItem);

    this.clear();
  }

  private unmockedGetItem(key: string) {
    return this.store[key] || null;
  }

  private unmockedSetItem(key: string, value: any) {
    this.store[key] = value.toString();
  }

  private unmockedRemoveItem(key: string) {
    delete this.store[key];
  }

  private unmockedClearItem() {
    this.store = {};
  }
}
