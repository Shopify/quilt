import {InjectedRouter, PlainRoute} from 'react-router';

export type FullLocation = Location & {query?: object; state?: object};

export interface FullRouter extends InjectedRouter {
  params: {[key: string]: string};
  location: FullLocation;
  routes: PlainRoute[];
}

export interface PartialRouter extends Partial<InjectedRouter> {
  params?: {[key: string]: string};
  location?: Partial<FullLocation>;
  routes?: PlainRoute[];
}

export interface RouterContext {
  router: FullRouter;
  routeDepth: number;
}

let defaultPathname = '/';

export function setDefaultPathname(pathname: string) {
  defaultPathname = pathname;
}

export function createRouter(stubs?: PartialRouter): FullRouter {
  const router = {
    makePath: jest.fn(),
    makeHref: jest.fn(),
    createHref: jest.fn((href: string) => href),
    createPath: jest.fn((href: string) => href),
    transitionTo: jest.fn(),
    replaceWith: jest.fn(),
    goBack: jest.fn(),
    params: {},
    getCurrentPath: jest.fn(),
    getCurrentRoutes: jest.fn(),
    getCurrentPathname: jest.fn(),
    getCurrentParams: jest.fn(),
    getCurrentQuery: jest.fn(),
    isActive: jest.fn(),
    getRouteAtDepth: jest.fn(),
    setRouteComponentAtDepth: jest.fn(),
    go: jest.fn(),
    goForward: jest.fn(),
    push: jest.fn(({pathname, query = {}}) => {
      router.location.pathname = pathname;
      router.location.query = query;
    }),
    routes: [],
    replace: jest.fn(),
    setRouteLeaveHook: jest.fn(),
    ...stubs,
    location: createLocation(stubs && stubs.location),
  };

  return router;
}

export function createLocation(stubs?: Partial<FullLocation>): FullLocation {
  return {
    href: '',
    host: '',
    hash: '',
    hostname: '',
    origin: '',
    port: '',
    protocol: '',
    search: '',
    pathname: defaultPathname,
    query: {},
    assign: jest.fn(),
    replace: jest.fn(),
    reload: jest.fn(),
    toString() {
      return JSON.stringify(this);
    },
    ...stubs,
  };
}
