import withEnv from '../index';

function wait(duration: number) {
  return new Promise(resolve => {
    setTimeout(resolve, duration);
  });
}

describe('withEnv NODE_ENV', () => {
  function getEnv() {
    return process.env.NODE_ENV;
  }

  it('changes the NODE_ENV for a standard Function', () => {
    withEnv('development', () => {
      expect(getEnv()).toBe('development');
    });
  });

  it('resets the NODE_ENV for a standard Function', () => {
    withEnv('development', () => {
      expect(getEnv()).toBe('development');
    });
    expect(getEnv()).toBe('test');
  });

  it('changes the NODE_ENV for an AsyncFunction', () => {
    withEnv('production', async () => {
      expect(getEnv()).toBe('production');
      await wait(50);
      expect(getEnv()).toBe('production');
    });
  });
});

describe('withEnv env object', () => {
  afterEach(() => {
    delete process.env.TEST_ONE;
    delete process.env.TEST_TWO;
    delete process.env.TEST_EXISTING;
  });

  it('changes multiple env vars', () => {
    withEnv({TEST_ONE: 'foo', TEST_TWO: 'bar'}, () => {
      expect(process.env.TEST_ONE).toBe('foo');
      expect(process.env.TEST_TWO).toBe('bar');
    });
  });

  it('does not override other env vars', () => {
    process.env.TEST_EXISTING = 'existing';

    withEnv({TEST_ONE: 'foo'}, () => {
      expect(process.env.TEST_ONE).toBe('foo');
      expect(process.env.TEST_EXISTING).toBe('existing');
    });
    expect(process.env.TEST_EXISTING).toBe('existing');
  });

  it('resets multiple env vars for a standard Function', () => {
    process.env.TEST_ONE = 'pre-test';

    withEnv({TEST_ONE: 'foo', TEST_TWO: 'bar'}, () => {
      expect(process.env.TEST_ONE).toBe('foo');
    });

    expect(process.env.TEST_ONE).toBe('pre-test');
  });

  it('clears env vars that were previously undefined', () => {
    withEnv({NON_EXISTING: 'foo'}, () => {
      expect(process.env.NON_EXISTING).toBe('foo');
    });

    expect(process.env.NON_EXISTING).toBeUndefined();
  });
});
