import path from 'path';
import {spawnSync} from 'child_process';

describe('types', () => {
  it('are checked', () => {
    const result = spawnSync('npx', ['tsd'], {
      cwd: path.join(__dirname),
      stdio: 'pipe',
    });

    expect(result.stderr.toString()).toStrictEqual('');
    expect(result.status).toStrictEqual(0);
  });
});
