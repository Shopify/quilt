import * as React from 'react';

export interface Registration {
  path: string | RegExp;
  render(url: URL): React.ReactNode;
}

export class PrefetchManager {
  registered: Set<Registration>;

  constructor(registered?: Registration[]) {
    this.registered = new Set(registered);
  }

  register(registration: Registration) {
    this.registered.add(registration);
    return () => this.registered.delete(registration);
  }
}

export const PrefetchContext = React.createContext<PrefetchManager>(
  new PrefetchManager(),
);
