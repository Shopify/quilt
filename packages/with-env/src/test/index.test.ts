import withEnv from '../index';

function getEnv() {
  return process.env.NODE_ENV;
}

function wait(duration: number) {
  return new Promise(resolve => {
    setTimeout(resolve, duration);
  });
}

describe('withEnv', () => {
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
