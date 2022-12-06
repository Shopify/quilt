import {StatsD, ClientOptions, ChildClientOptions} from 'hot-shots';
import {snakeCase} from 'change-case';

const UNKNOWN = 'Unknown';

export interface Logger {
  log(message: string): void;
}

type Tags =
  | {[key: string]: string | number | boolean | null | undefined}
  | string[];

export interface Options extends ClientOptions {
  logger?: Logger;
  snakeCase?: boolean;
}

export interface ChildOptions extends ChildClientOptions {
  client: StatsDClient;
  snakeCase?: boolean;
}

export class StatsDClient {
  protected statsd: StatsD;
  protected logger: Logger = console;
  protected options: Options;

  constructor(options: Options | ChildOptions) {
    if (isChildOptions(options)) {
      const {client, ...childOptions} = options;
      this.logger = client.logger;
      this.options = {...client.options, ...childOptions};
      this.statsd = client.statsd.childClient(childOptions);
      return;
    }

    const {logger, snakeCase, ...statsdOptions} = options;

    if (logger) {
      this.logger = logger;
    }

    this.options = {
      ...options,
      errorHandler: statsdOptions.errorHandler
        ? statsdOptions.errorHandler
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
    return new Promise<void>((resolve) => {
      this.statsd.distribution(
        stat,
        value,
        this.normalizeTags(tags),
        this.createCallback(resolve),
      );
    });
  }

  timing(stat: string | string[], value: number, tags?: Tags) {
    return new Promise<void>((resolve) => {
      this.statsd.timing(
        stat,
        value,
        this.normalizeTags(tags),
        this.createCallback(resolve),
      );
    });
  }

  gauge(stat: string | string[], value: number, tags?: Tags) {
    return new Promise<void>((resolve) => {
      this.statsd.gauge(
        stat,
        value,
        this.normalizeTags(tags),
        this.createCallback(resolve),
      );
    });
  }

  increment(stat: string | string[], tags?: Tags) {
    return new Promise<void>((resolve) => {
      this.statsd.increment(
        stat,
        1,
        this.normalizeTags(tags),
        this.createCallback(resolve),
      );
    });
  }

  close() {
    return new Promise<void>((resolve) => {
      this.statsd.close(this.createCallback(resolve));
    });
  }

  childClient(options?: Omit<ChildOptions, 'client'>) {
    return new StatsDClient({client: this, ...options});
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

    const output: {[key: string]: string} = {};

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

function isChildOptions(
  options: Options | ChildOptions,
): options is ChildOptions {
  return 'client' in options;
}
