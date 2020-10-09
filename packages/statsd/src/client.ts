import {StatsD, ClientOptions} from 'hot-shots';
import {snakeCase} from 'change-case';

const UNKNOWN = 'Unknown';

export interface Logger {
  log(message: string): void;
}

type Tags =
  | Record<string, string | number | boolean | null | undefined>
  | string[];

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
              `Error occurred in the StatsD client:\n${
                error.stack || error.message
              }`,
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

  timing(stat: string | string[], value: number, tags?: Tags) {
    return new Promise<void>(resolve => {
      this.statsd.timing(
        stat,
        value,
        this.normalizeTags(tags),
        this.createCallback(resolve),
      );
    });
  }

  gauge(stat: string | string[], value: number, tags?: Tags) {
    return new Promise<void>(resolve => {
      this.statsd.gauge(
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
      globalTags: this.normalizeTags(globalTags),
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

  private normalizeTags(tags: Tags = []) {
    if (Array.isArray(tags)) {
      return tags;
    }

    const output: Record<string, string> = {};

    for (const [key, value] of Object.entries(tags)) {
      const newValue = value == null ? UNKNOWN : String(value);

      if (this.options.snakeCase) {
        output[snakeCase(key)] = newValue;
      } else {
        output[key] = newValue;
      }
    }

    return output;
  }
}
