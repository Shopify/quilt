import httpMocks, {RequestMethod} from 'node-mocks-http';
import stream from 'stream';
import Koa, {Context} from 'koa';

import createMockCookies, {MockCookies} from '../create-mock-cookies';

export interface Dictionary<T> {
  [key: string]: T;
}

export interface MockContext extends Context {
  cookies: MockCookies;
}

export interface Options extends Dictionary<any> {
  url?: string;
  method?: RequestMethod;
  statusCode?: number;
  session?: Dictionary<any>;
  headers?: Dictionary<string>;
  cookies?: Dictionary<string>;
  [key: string]: any;
}

export default function createContext(options: Options = {}): MockContext {
  const app = new Koa();
  app.proxy = true;

  const {
    url,
    cookies,
    method,
    statusCode,
    session,
    headers,
    ...customFields
  } = options;
  const extensions = {...customFields, session};

  Object.keys(extensions).forEach(key => {
    app.context[key] = extensions[key];
  });

  const req = httpMocks.createRequest({
    url,
    method,
    statusCode,
    session,
    headers,
  });

  // Some functions we call in the implementations will perform checks for `req.encrypted`, which delegates to the socket.
  // MockRequest doesn't set a fake socket itself, so we create one here.
  req.socket = new stream.Duplex() as any;

  const res = httpMocks.createResponse();

  // This is to get around an odd behavior in the `cookies` library, where if `res.set` is defined, it will use an internal
  // node function to set headers, which results in them being set in the wrong place.
  // eslint-disable-next-line no-undefined
  res.set = undefined as any;

  const context = app.createContext(req, res) as Context;

  context.cookies = createMockCookies(cookies);

  return context as any;
}
