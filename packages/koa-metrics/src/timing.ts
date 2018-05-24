import {StatsD} from 'hot-shots';
import {Context} from 'koa';

export interface Timer {
  close(responseClient?: StatsD): void;
}

export function initTimer(client: StatsD, ctx: Context): Timer {
  const startTime = process.hrtime();

  const requestQueuingTime = ctx.request.get('X-Request-Start');
  if (requestQueuingTime) {
    try {
      const timeAsInt = parseInt(requestQueuingTime, 10);
      client.timing('request_queuing_time', timeAsInt);
    } catch (err) {
      // this is a non-critical error, so we can continue execution.
    }
  }

  function close(responseClient = client) {
    const duration = process.hrtime(startTime);
    const [seconds, nanoseconds] = duration;
    const milliseconds = seconds * 1000 + nanoseconds / 1e6;
    responseClient.timing('request_time', Math.round(milliseconds));
  }

  return {close};
}
