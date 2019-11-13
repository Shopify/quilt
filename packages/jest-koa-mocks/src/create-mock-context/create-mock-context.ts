import * as httpMocks from 'node-mocks-http'
import * as Koa from 'koa'

export interface MockContext<RequestBody = undefined> extends Koa.Context {
  request: Koa.Context['request'] & {
    body?: RequestBody
  }
}

export const koaMockContext = <
  State = Koa.DefaultState,
  Context = MockContext,
  RequestBody = undefined
>(
  requestBody?: RequestBody
) => {
  const req = httpMocks.createRequest()
  const res = httpMocks.createResponse()
  const app = new Koa<State, Context>()
  const context = app.createContext(req, res) as MockContext<RequestBody> & Koa.ParameterizedContext<State, Context>
  res.statusCode = 404
  context.request.body = requestBody
  return context
}
