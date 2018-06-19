import {StatsD} from 'hot-shots';

enum MetricType {
  Timing = 'timing',
  Histogram = 'histogram',
}

export interface TagsMap {
  [key: string]: string;
}

export type Tags = TagsMap | string[];

export interface MetricsConfig {
  host: string;
  port: number;
  prefix: string;
  globalTags?: Tags;
}

export interface Logger {
  (msg: string): void;
}

export interface Timer {
  stop(): number;
}

export default class Metrics {
  private rootClient: StatsD;
  private client: StatsD;

  constructor(
    {host, port, prefix, globalTags}: MetricsConfig,
    private logger?: Logger,
  ) {
    this.rootClient = new StatsD({
      host,
      port,
      prefix,
      globalTags,
    });
    this.client = this.rootClient;
  }

  public timing(name: string, value: number, tags?: Tags) {
    this.log(MetricType.Timing, name, value, tags);
    // the any type below is to fix the improper typing on the histogram method
    this.client.timing(name, value, tags as any);
  }

  public histogram(name: string, value: number, tags?: Tags) {
    this.log(MetricType.Histogram, name, value, tags);
    // the any type below is to fix the improper typing on the histogram method
    this.client.histogram(name, value, tags as any);
  }

  public initTimer(): Timer {
    const startTime = process.hrtime();

    function stop() {
      const duration = process.hrtime(startTime);
      const [seconds, nanoseconds] = duration;
      const milliseconds = seconds * 1000 + nanoseconds / 1e6;
      return Math.round(milliseconds);
    }

    return {stop};
  }

  public addGlobalTags(globalTags: Tags) {
    this.client = this.client.childClient({
      globalTags,
    });
  }

  public closeClient() {
    // @ts-ignore According to the hot-shots documentation, callback
    // is not required.
    this.rootClient.close();
  }

  private log(type: MetricType, name: string, value: number, tags?: Tags) {
    // eslint-disable-next-line no-process-env
    if (process.env.NODE_ENV !== 'development' || this.logger == null) {
      return;
    }

    let msg = `${type} ${name}:${value}`;
    if (tags != null) {
      for (const tagName of Object.keys(tags)) {
        msg += ` #${tagName}:${tags[tagName]}`;
      }
    }

    this.logger(msg);
  }
}
