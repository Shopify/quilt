describe('Metrics', () => {
  it.skip(
    'passes the host, port, prefix, and global tags to the statsd client',
  );

  describe('timing', () => {
    it.skip('passes timing metrics to the statsd client');

    it.skip('logs timing metrics to the logger in development');

    it.skip('does not log timing metrics to the logger in production');
  });

  describe('histogram', () => {
    it.skip('passes histogram metrics to the statsd client');

    it.skip('logs histogram metrics to the logger in development');

    it.skip('does not log histogram metrics to the logger in production');
  });

  describe('addGlobalTags', () => {
    it.skip('uses the passed in global tags for future requests');
  });

  describe('closeClient', () => {
    it.skip('closes the underlying statsd client');
  });

  describe('Timer', () => {
    it.skip('initTimer returns a Timer whose stop method returns an integer');
  });
});
