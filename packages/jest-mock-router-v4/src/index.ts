import {RouterChildContext} from 'react-router';

export interface PartialRouterContext {
  history?: RouterChildContext<any>['router']['history'];
  route?: {
    location?: Partial<RouterChildContext<any>['router']['route']['location']>;
    match?: Partial<RouterChildContext<any>['router']['route']['match']>;
  };
}

export function createDefaultHistory(): RouterChildContext<
  any
>['router']['history'] {
  return {
    length: 0,
    action: 'POP',
    location: createDefaultLocation(),
    push: jest.fn(),
    replace: jest.fn(),
    go: jest.fn(),
    goBack: jest.fn(),
    goForward: jest.fn(),
    block: jest.fn(),
    listen: jest.fn(),
    createHref: jest.fn(),
  };
}

export function createDefaultMatch(): RouterChildContext<
  any
>['router']['route']['match'] {
  return {path: '/', url: '/', isExact: true, params: {}};
}

export function createDefaultLocation(): RouterChildContext<
  any
>['router']['route']['location'] {
  return {
    pathname: '/',
    search: '',
    state: '',
    hash: '',
  };
}

export function createDefaultRouterContext(): RouterChildContext<
  any
>['router'] {
  return {
    history: createDefaultHistory(),
    route: {
      location: createDefaultLocation(),
      match: createDefaultMatch(),
    },
  };
}
