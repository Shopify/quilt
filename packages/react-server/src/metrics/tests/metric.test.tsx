import {saddle, unsaddle} from 'saddle-up/koa';

import {metricsMiddleware} from '../metrics';

describe('createServer()', () => {
  afterAll(unsaddle);

  it('responds with a Server-Timing header', async () => {
    const wrapper = await saddle(metricsMiddleware);
    const response = await wrapper.fetch('/');

    expect(await response.clone().headers.get('server-timing')).toStrictEqual(
      expect.any(String),
    );
  });
});
