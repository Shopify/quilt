import {getSerializationsFromDocument} from './utilities';

export default class Manager {
  private isServer = typeof document === 'undefined';
  private serializations = getSerializationsFromDocument();

  set(id: string, data: unknown) {
    if (this.isServer) {
      this.serializations.set(id, data);
    }
  }

  get<T>(id: string): T | undefined {
    return this.serializations.get(id) as T | undefined;
  }

  extract() {
    return [...this.serializations.entries()].map(([id, data]) => ({
      id,
      data,
    }));
  }
}
