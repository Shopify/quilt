import compose from 'koa-compose';
import {Context} from 'koa';

export {Context};

export type NextFunction = () => Promise<void>;

export type Middleware<
  CustomizeContext extends Context = Context
> = compose.Middleware<CustomizeContext>;
