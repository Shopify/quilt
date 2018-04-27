import {URL} from 'url';
import httpMocks, {RequestMethod} from 'node-mocks-http';
import stream from 'stream';
import Koa, {Context} from 'koa';

import createMockCookies, {MockCookies} from '../create-mock-cookies';

export interface Dictionary<T> {
  [key: string]: T;
}

export interface MockContext extends Context {
  cookies: MockCookies;
  request: Context['Request'] & {body?: any};
}

export interface Options<T extends Object> extends Dictionary<any> {
  url?: string;
  method?: RequestMethod;
  statusCode?: number;
  session?: Dictionary<any>;
  headers?: Dictionary<string>;
  cookies?: Dictionary<string>;
  encrypted?: boolean;
  host?: string;
  requestBody?: any;
  customProperties?: T;
}

export default function createContext<T>(
  options: Options<T> = {},
): MockContext & T {
  const app = new Koa();

  const {
    url = '',
    cookies,
    method,
    statusCode,
    session,
    headers = {},
    encrypted = false,
    host = 'test.com',
    requestBody,
    customProperties = {},
  } = options;

  const extensions = {...customProperties, session};

  Object.assign(app.context, extensions);

  const protocolFallback = encrypted ? 'https' : 'http';
  const urlObject = new URL(url, `${protocolFallback}://${host}`);

  const req = httpMocks.createRequest({
    url: urlObject.toString(),
    method,
    statusCode,
    session,
    headers: {
      // Koa determines protocol based on the `Host` header.
      Host: urlObject.host,
      ...headers,
    },
  });

  // Some functions we call in the implementations will perform checks for `req.encrypted`, which delegates to the socket.
  // MockRequest doesn't set a fake socket itself, so we create one here.
  req.socket = new stream.Duplex() as any;
  Object.defineProperty(req.socket, 'encrypted', {
    writable: false,
    value: urlObject.protocol === 'https:',
  });

  const res = httpMocks.createResponse();
  // This is to get around an odd behavior in the `cookies` library, where if `res.set` is defined, it will use an internal
  // node function to set headers, which results in them being set in the wrong place.
  // eslint-disable-next-line no-undefined
  res.set = undefined as any;

  const context = app.createContext(req, res) as MockContext & T;
  context.cookies = createMockCookies(cookies);

  // ctx.request.body is a common enough custom property for middleware to add that it's handy to just support it by default
  context.request.body = requestBody;

  return context;
}
