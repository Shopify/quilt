import {ResourcePool} from '..';

const endOfPollPhase = {then: setImmediate};

class TestResource {
  isDestroyed = false;
}

function createResourcePool(count: number) {
  return new ResourcePool<TestResource>({
    count,
    createResource() {
      return new TestResource();
    },
    destroyResource(resource) {
      resource.isDestroyed = true;
    },
  });
}

describe('ResourcePool', () => {
  describe('constructor()', () => {
    it('calls createResource count times', () => {
      const createResource = jest.fn();
      const destroyResource = jest.fn();

      const resourcePool = new ResourcePool<TestResource>({
        count: 3,
        createResource,
        destroyResource,
      });

      expect(resourcePool).toBeDefined();
      expect(createResource).toHaveBeenCalledTimes(3);
      expect(destroyResource).not.toHaveBeenCalled();
    });
  });

  describe('acquire()', () => {
    it('resolves when there are resources available', async () => {
      const resourcePool = createResourcePool(1);

      const {resource, release} = await resourcePool.acquire();

      expect(resource).toBeInstanceOf(TestResource);
      expect(release).toBeInstanceOf(Function);
    });

    it('does not resolve when there are no resources available', async () => {
      const resourcePool = createResourcePool(1);

      await resourcePool.acquire();

      const spy = jest.fn();

      resourcePool
        .acquire()
        .then(spy)
        .catch(() => {});

      await endOfPollPhase;

      expect(spy).not.toHaveBeenCalled();
    });

    it('resolves when a previously acquired resource is released before the call', async () => {
      const resourcePool = createResourcePool(1);

      const {release: release1} = await resourcePool.acquire();
      await release1();

      const spy = jest.fn();

      await resourcePool
        .acquire()
        .then(spy)
        .catch(() => {});

      expect(spy).toHaveBeenCalled();
    });

    it('resolves when a previously acquired resource is released after the call', async () => {
      const resourcePool = createResourcePool(1);

      const {release: release1} = await resourcePool.acquire();

      const spy = jest.fn();

      resourcePool
        .acquire()
        .then(spy)
        .catch(() => {});

      await endOfPollPhase;

      expect(spy).not.toHaveBeenCalled();

      await release1();

      expect(spy).toHaveBeenCalled();
    });

    it('gets resolved in the same order as called when previous resources are released', async () => {
      const resourcePool = createResourcePool(2);

      const {release: release1} = await resourcePool.acquire();
      const {release: release2} = await resourcePool.acquire();

      const spy3 = jest.fn();
      const spy4 = jest.fn();

      resourcePool
        .acquire()
        .then(spy3)
        .catch(() => {});
      resourcePool
        .acquire()
        .then(spy4)
        .catch(() => {});

      await endOfPollPhase;

      expect(spy3).not.toHaveBeenCalled();
      expect(spy4).not.toHaveBeenCalled();

      await release2();

      expect(spy3).toHaveBeenCalled();
      expect(spy4).not.toHaveBeenCalled();

      await release1();

      expect(spy4).toHaveBeenCalled();
    });
  });

  describe('resource.release()', () => {
    it('when called a second time has no effect', async () => {
      const resourcePool = createResourcePool(1);

      const {release} = await resourcePool.acquire();

      const spy2 = jest.fn();
      const spy3 = jest.fn();

      resourcePool
        .acquire()
        .then(spy2)
        .catch(() => {});
      resourcePool
        .acquire()
        .then(spy3)
        .catch(() => {});

      await endOfPollPhase;

      expect(spy2).not.toHaveBeenCalled();
      expect(spy3).not.toHaveBeenCalled();

      await release();

      expect(spy2).toHaveBeenCalled();
      expect(spy3).not.toHaveBeenCalled();

      await release();

      expect(spy3).not.toHaveBeenCalled();
    });
  });

  describe('destroy()', () => {
    it('calls destroyResource count times', () => {
      const createResource = jest.fn(() => new TestResource());
      const destroyResource = jest.fn();

      const resourcePool = new ResourcePool({
        count: 3,
        createResource,
        destroyResource,
      });

      resourcePool.destroy();

      expect(destroyResource).toHaveBeenCalledTimes(3);

      const instances = destroyResource.mock.calls.map(call => call[0]);

      instances.forEach((instance, index) => {
        expect(instance).toBeInstanceOf(TestResource);
        expect(instances.lastIndexOf(instance)).toBe(index);
      });
    });

    it('calls destroyResource count times even with acquired resources', async () => {
      const createResource = jest.fn(() => new TestResource());
      const destroyResource = jest.fn();

      const resourcePool = new ResourcePool({
        count: 3,
        createResource,
        destroyResource,
      });

      await resourcePool.acquire();

      resourcePool.destroy();

      expect(destroyResource).toHaveBeenCalledTimes(3);

      const instances = destroyResource.mock.calls.map(call => call[0]);

      instances.forEach((instance, index) => {
        expect(instance).toBeInstanceOf(TestResource);
        expect(instances.lastIndexOf(instance)).toBe(index);
      });
    });
  });
});
