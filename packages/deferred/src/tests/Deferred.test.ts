import {Deferred} from '..';

describe('Deferred', () => {
  it('resolves promise with value', async () => {
    const deferred = new Deferred();
    deferred.resolve('resolved');

    expect(await deferred.promise).toStrictEqual('resolved');
  });

  it('rejects promise with value', async () => {
    const deferred = new Deferred();
    deferred.reject('rejected');

    await expect(deferred.promise).rejects.toStrictEqual('rejected');
  });
});
