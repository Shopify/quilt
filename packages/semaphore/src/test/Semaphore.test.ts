import {Semaphore, Permit} from '..';

describe('Semaphore', () => {
  describe('acquire()', () => {
    it('resolves with a permit when counter is > 0', async () => {
      const semaphore = new Semaphore(1);

      expect(await semaphore.acquire()).toBeInstanceOf(Permit);
    });

    it('does not resolve if counter is = 0', async () => {
      const semaphore = new Semaphore(1);

      await semaphore.acquire();

      const spy = jest.fn();

      semaphore
        .acquire()
        .then(spy)
        .catch(() => {});

      await setTimeout(() => {}, 0);

      expect(spy).not.toHaveBeenCalled();
    });

    it('resolves when previous permit is released before the call', async () => {
      const semaphore = new Semaphore(1);

      const permit = await semaphore.acquire();
      permit.release();

      expect(await semaphore.acquire()).toBeInstanceOf(Permit);
    });

    it('resolves when previous permit is released after the call', async () => {
      const semaphore = new Semaphore(1);

      const permit = await semaphore.acquire();

      const spy = jest.fn();

      semaphore
        .acquire()
        .then(spy)
        .catch(() => {});

      await setTimeout(() => {}, 0);

      expect(spy).not.toHaveBeenCalled();

      await permit.release();

      expect(spy).toHaveBeenCalledWith(expect.any(Permit));
    });

    it('calls resolve in same order as called when previous permits are released', async () => {
      const semaphore = new Semaphore(2);

      const permit1 = await semaphore.acquire();
      const permit2 = await semaphore.acquire();

      const spy3 = jest.fn();
      const spy4 = jest.fn();

      semaphore
        .acquire()
        .then(spy3)
        .catch(() => {});
      semaphore
        .acquire()
        .then(spy4)
        .catch(() => {});

      await setTimeout(() => {}, 0);

      expect(spy3).not.toHaveBeenCalled();
      expect(spy4).not.toHaveBeenCalled();

      await permit2.release();

      expect(spy3).toHaveBeenCalledWith(expect.any(Permit));
      expect(spy4).not.toHaveBeenCalled();

      await permit1.release();

      expect(spy4).toHaveBeenCalledWith(expect.any(Permit));
    });

    it('does not allow acquiring more permits than initially allowed', async () => {
      const semaphore = new Semaphore(1);

      const promise1 = semaphore.acquire();
      const promise2 = semaphore.acquire();

      (await promise1).release();
      (await promise2).release();

      const spy3 = jest.fn();
      const spy4 = jest.fn();

      semaphore
        .acquire()
        .then(spy3)
        .catch(() => {});
      semaphore
        .acquire()
        .then(spy4)
        .catch(() => {});

      await setTimeout(() => {}, 0);

      expect(spy3).toHaveBeenCalledWith(expect.any(Permit));
      expect(spy4).not.toHaveBeenCalled();
    });
  });
});

describe('Permit', () => {
  describe('release()', () => {
    it('has no effect when called a second time', async () => {
      const semaphore = new Semaphore(1);

      const permit = await semaphore.acquire();

      const spy2 = jest.fn();
      const spy3 = jest.fn();

      semaphore
        .acquire()
        .then(spy2)
        .catch(() => {});
      semaphore
        .acquire()
        .then(spy3)
        .catch(() => {});

      await permit.release();

      expect(spy2).toHaveBeenCalledWith(expect.any(Permit));
      expect(spy3).not.toHaveBeenCalled();

      await permit.release();

      expect(spy3).not.toHaveBeenCalled();
    });
  });
});
