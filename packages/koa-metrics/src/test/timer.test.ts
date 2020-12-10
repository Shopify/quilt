import {initTimer} from '../timer';

const NODE_VERSION = process.version;

describe('timer', () => {
  it('measures the time between when initTimer and the returned timer objects stop method is called', async () => {
    const timer = initTimer();
    await delay(10);
    const durationMillis = timer.stop();

    // Node 14 CI test are flaky with this test
    expect(durationMillis).toBeGreaterThanOrEqual(isNode14() ? 9 : 10);
  });
});

function delay(milliseconds: number) {
  return new Promise(resolve => {
    setTimeout(resolve, milliseconds);
  });
}

function isNode14() {
  return NODE_VERSION.includes('v14.');
}
