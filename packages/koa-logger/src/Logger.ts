import {v4 as uuid} from 'uuid';

export interface LoggingContext {
  [key: string]: any;
}

export default class Logger {
  private buffer: string | null = null;
  private requestId: string = uuid();
  private context: LoggingContext = {};

  log(message: string) {
    if (process.env.NODE_ENV === 'development') {
      const logMessage = `[request id=${this.requestId}] ${message}`;
      // eslint-disable-next-line no-console
      console.log(logMessage);
    } else {
      this.buffer =
        this.buffer == null ? message : `${this.buffer}\n${message}`;
    }
  }

  addContext(ctx: LoggingContext, prefix?: string) {
    const prefixedCtx =
      prefix == null
        ? ctx
        : Object.keys(ctx).reduce((acc: LoggingContext, cur: string) => {
            acc[`${prefix}_${cur}`] = ctx[cur];
            return acc;
          }, {});

    this.context = {
      ...this.context,
      ...prefixedCtx,
    };
  }

  flush() {
    if (process.env.NODE_ENV === 'production') {
      const logObject = {
        ...this.context,
        payload: this.buffer,
        // eslint-disable-next-line camelcase
        request_id: this.requestId,
      };

      // eslint-disable-next-line no-console
      console.log(JSON.stringify(logObject));
    }
  }
}
