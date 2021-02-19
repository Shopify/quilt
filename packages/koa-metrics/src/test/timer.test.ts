import {initTimer} from '../timer';

const NODE_VERSION = process.version;

describe('timer', () => {
  it('measures the time between when initTimer and the returned timer objects stop method is called', async () => {
    const timer = initTimer();
    await delay(10);
    const durationMillis = timer.stop();

    expect(durationMillis).toBeGreaterThanOrEqual(9);
  });
});

function delay(milliseconds: number) {
  return new Promise(resolve => {
    setTimeout(resolve, milliseconds);
  });
}
