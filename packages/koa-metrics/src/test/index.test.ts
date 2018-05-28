describe('koa-metrics', () => {
  it.skip('provides a Metrics client as ctx.metrics');

  it.skip('uses the provided prefix for metrics metrics');

  it.skip('uses the provided host for the metrics client');

  describe('logging', () => {
    it.skip('uses the provided logger for the metrics client');

    it.skip(
      'uses ctx.log for the metrics client if available and no logger was provided',
    );

    it.skip(
      'uses console.log for the metrics client if no logger was provided and ctx.log is undefined',
    );
  });

  describe('request_queuing_time', () => {
    it.skip('logs the queuing time based on the X-Request-Start header');

    it.skip(
      'does not log the queuing time when the X-Request-Start header is not present',
    );

    it.skip(
      'emits the queuing time metric when the request processing begins (i.e. before calling next())',
    );

    it.skip('tags the log with the path');

    it.skip('tags the log with the request method');
  });

  describe('request_time', () => {
    it.skip('logs the request time');

    it.skip('tags the log with the path');

    it.skip('tags the log with the request method');

    it.skip('tags the log with the response code');

    it.skip('tags the log with the response type');
  });

  describe('request_content_length', () => {
    it.skip(
      'logs the request content length based on the Content-Length header',
    );

    it.skip('logs undefined when the Content-Length header is not present');

    it.skip('tags the log with the path');

    it.skip('tags the log with the request method');

    it.skip('tags the log with the response code');

    it.skip('tags the log with the response type');
  });
});
