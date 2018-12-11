import {StatsD} from 'hot-shots';

enum MetricType {
  Distribution = 'distribution',
  Measure = 'measure',
}

export interface TagsMap {
  [key: string]: string;
}

export interface MetricsConfig {
  host: string;
  port: number;
  prefix: string;
  globalTags?: TagsMap;
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

  public distribution(name: string, value: number, tags?: TagsMap) {
    this.log(MetricType.Distribution, name, value, tags);
    // the any type below is to fix the improper typing on the histogram method
    this.client.distribution(name, value, tags as any);
  }

  public measure(name: string, value: number, tags?: TagsMap) {
    this.log(MetricType.Measure, name, value, tags);
    // the any type below is to fix the improper typing on the distribution method
    this.client.distribution(name, value, tags as any);
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

  public addGlobalTags(globalTags: TagsMap) {
    this.client = this.client.childClient({
      globalTags,
    });
  }

  public closeClient() {
    // @ts-ignore According to the hot-shots documentation, callback
    // is not required.
    this.rootClient.close();
  }

  private log(type: MetricType, name: string, value: number, tags?: TagsMap) {
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
