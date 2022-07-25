import {RouterChildContext} from 'react-router-dom';

export interface PartialRouterContext {
  history?: RouterChildContext<any>['router']['history'];
  route?: {
    location?: Partial<RouterChildContext<any>['router']['route']['location']>;
    match?: Partial<RouterChildContext<any>['router']['route']['match']>;
  };
}
export function createDefaultHistory(): RouterChildContext<any>['router']['history'] {
  return {
    listenBefore: jest.fn(),
    listen: jest.fn(),
    transitionTo: jest.fn(),
    push: jest.fn(),
    replace: jest.fn(),
    go: jest.fn(),
    goBack: jest.fn(),
    goForward: jest.fn(),
    createKey: jest.fn(),
    createPath: jest.fn(),
    createHref: jest.fn(),
    createLocation: jest.fn(),
    getCurrentLocation: createDefaultLocation,
  };
}

export function createDefaultMatch(): RouterChildContext<any>['router']['route']['match'] {
  return {path: '/', url: '/', isExact: true, params: {}};
}

export function createDefaultLocation(): RouterChildContext<any>['router']['route']['location'] {
  return {
    pathname: '/',
    search: '',
    state: '',
    hash: '',
    action: 'POP',
    key: '',
    query: {key: ''},
  };
}

export function createDefaultRouterContext(): RouterChildContext<any>['router'] {
  return {
    history: createDefaultHistory(),
    route: {
      location: createDefaultLocation(),
      match: createDefaultMatch(),
    },
  };
}
