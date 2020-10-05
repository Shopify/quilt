import {saddle, unsaddle} from 'saddle-up/koa';
import {StatusCode} from '@shopify/network';

import {ping} from './ping';

describe('ping', () => {
  afterAll(unsaddle);

  it('responds with pong', async () => {
    const wrapper = await saddle(ping);
    const response = await wrapper.fetch('/');

    await expect(response).toHaveBodyText('Pong');
    await expect(response).toHaveStatus(StatusCode.Ok);
  });
});
