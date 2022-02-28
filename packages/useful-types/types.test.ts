import path from 'path';

// eslint-disable-next-line import/no-extraneous-dependencies
import tsd from 'tsd';

function checkTypes() {
  return tsd({
    cwd: path.join(__dirname),
    testFiles: ['types.test-d.ts'],
  });
}

describe('types', () => {
  it('are checked', async () => {
    await checkTypes().then((diagnostics) => {
      expect(diagnostics).toHaveLength(0);
    });
  });
});
