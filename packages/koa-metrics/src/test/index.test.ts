describe('koa-metrics', () => {
  it.skip('provides a hot-shots client as ctx.state.statsd');

  it.skip('uses the provided prefix for statsd metrics');

  it.skip('uses the provided host for the statsd client');

  describe('request_queuing_time', () => {
    it.skip('logs the queuing time based on the X-Request-Start header');

    it.skip(
      'does not log the queuing time when the X-Request-Start header is not present',
    );

    it.skip(
      'emits this metric when the request processing begins (i.e. before calling next())',
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
