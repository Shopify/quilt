import {StatsD, ClientOptions, Tags} from 'hot-shots';
import {snakeCase} from 'change-case';

export interface Logger {
  log(message: string): void;
}

export interface Options extends ClientOptions {
  logger?: Logger;
  snakeCase?: boolean;
}

export class StatsDClient {
  private statsd: StatsD;
  private logger: Logger = console;
  private options: Options;

  constructor({logger, ...options}: Options) {
    if (logger) {
      this.logger = logger;
    }

    this.options = {
      ...options,
      errorHandler: options.errorHandler
        ? options.errorHandler
        : (error: Error) => {
            this.logger.log(
              `Error occurred in the StatsD client:\n${error.stack ||
                error.message}`,
            );
          },
    };

    this.statsd = new StatsD(this.options);
  }

  distribution(stat: string | string[], value: number, tags?: Tags) {
    return new Promise<void>(resolve => {
      this.statsd.distribution(
        stat,
        value,
        this.normalizeTags(tags),
        this.createCallback(resolve),
      );
    });
  }

  increment(stat: string | string[], tags?: Tags) {
    return new Promise<void>(resolve => {
      this.statsd.increment(
        stat,
        1,
        this.normalizeTags(tags),
        this.createCallback(resolve),
      );
    });
  }

  close() {
    return new Promise<void>(resolve => {
      this.statsd.close(this.createCallback(resolve));
    });
  }

  addGlobalTags(globalTags: Tags) {
    this.statsd = this.statsd.childClient({
      globalTags,
    });
  }

  private createCallback<T>(resolve: (value?: T | PromiseLike<T>) => void) {
    return (error?: Error) => {
      if (error && this.options.errorHandler) {
        this.options.errorHandler(error);
      }

      resolve();
    };
  }

  private normalizeTags(tags?: Tags) {
    if (!this.options.snakeCase) {
      return tags;
    }

    return snakeCaseTags(tags);
  }
}

function snakeCaseTags(tags?: Tags): Tags | undefined {
  if (tags == null) {
    return tags;
  }

  return Object.keys(tags).reduce(
    (object, tag) => ({...object, [snakeCase(tag)]: (tags as any)[tag]}),
    {},
  );
}
