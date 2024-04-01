import type {
  ClientOptions as HotShotClientOptions,
  ChildClientOptions as HotShotChildOptions,
} from 'hot-shots';
import {StatsD} from 'hot-shots';
import {snakeCase} from 'change-case';

const UNKNOWN = 'Unknown';

export interface Logger {
  log(message: string): void;
}

type Tags =
  | {[key: string]: string | number | boolean | null | undefined}
  | string[];

export interface ClientOptions extends HotShotClientOptions {
  logger?: Logger;
  snakeCase?: boolean;
}

export interface ChildOptions extends HotShotChildOptions {
  client: StatsDClient;
  snakeCase?: boolean;
}

export interface MetricOptions {
  sampleRate?: number;
}

export type Options = ClientOptions | ChildOptions;

export class StatsDClient<Stat extends string = string> {
  protected statsd: StatsD;
  protected logger: Logger = console;
  protected options: ClientOptions;

  constructor(options: Options) {
    if (isChildOptions(options)) {
      const {client, prefix, ...childOptions} = options;
      this.logger = client.logger;
      this.options = {...client.options, ...childOptions};
      this.statsd = client.statsd.childClient(childOptions);

      if (prefix) {
        // The concatenation of the prefix in the library is the inverse of what we want.
        // The library concatenates the prefix like that: <ChildPrefix><ParentPrefix>
        // but in most case we want to concatenate like this: <ParentPrefix><ChildPrefix>
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        this.statsd.prefix = `${this.statsd.prefix}${prefix}`;
      }
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

  distribution(
    stat: Stat | Stat[],
    value: number,
    tags?: Tags,
    options: MetricOptions = {},
  ) {
    return new Promise<void>((resolve) => {
      this.statsd.distribution(
        stat,
        value,
        options.sampleRate,
        this.normalizeTags(tags),
        this.createCallback(resolve),
      );
    });
  }

  timing(
    stat: Stat | Stat[],
    value: number,
    tags?: Tags,
    options: MetricOptions = {},
  ) {
    return new Promise<void>((resolve) => {
      this.statsd.timing(
        stat,
        value,
        options.sampleRate,
        this.normalizeTags(tags),
        this.createCallback(resolve),
      );
    });
  }

  gauge(
    stat: Stat | Stat[],
    value: number,
    tags?: Tags,
    options: MetricOptions = {},
  ) {
    return new Promise<void>((resolve) => {
      this.statsd.gauge(
        stat,
        value,
        options.sampleRate,
        this.normalizeTags(tags),
        this.createCallback(resolve),
      );
    });
  }

  increment(
    stat: Stat | Stat[],
    tags?: Tags,
    options: MetricOptions = {},
    value = 1,
  ) {
    return new Promise<void>((resolve) => {
      this.statsd.increment(
        stat,
        value,
        options.sampleRate,
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

  childClient<ChildStat extends string = Stat>(
    options?: Omit<ChildOptions, 'client'>,
  ) {
    return new StatsDClient<ChildStat>({client: this, ...options});
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

function isChildOptions(options: Options): options is ChildOptions {
  return 'client' in options;
}
