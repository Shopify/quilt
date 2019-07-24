import {Semaphore} from '@shopify/semaphore';

type CreateResourceCallback<T> = () => T;
type DestroyResourceCallback<T> = (resource: T) => void;

interface ResourcePoolOptions<T> {
  count: number;
  createResource: CreateResourceCallback<T>;
  destroyResource: DestroyResourceCallback<T>;
}

export class ResourcePool<T> {
  private semaphore: Semaphore;
  private destroyResource: DestroyResourceCallback<T>;
  private availableResources: T[];
  private acquiredResources: T[];

  constructor({
    count,
    createResource,
    destroyResource,
  }: ResourcePoolOptions<T>) {
    this.semaphore = new Semaphore(count);
    this.destroyResource = destroyResource;

    this.availableResources = Array(count)
      .fill(undefined)
      .map(createResource);
    this.acquiredResources = [];
  }

  async acquire() {
    const permit = await this.semaphore.acquire();

    const resource = this.availableResources.pop()!;

    this.acquiredResources.push(resource);

    return {
      resource,
      release: async () => {
        const idx = this.acquiredResources.indexOf(resource);
        this.acquiredResources.splice(idx, 1);
        this.availableResources.push(resource);
        await permit.release();
      },
    };
  }

  destroy() {
    this.availableResources.forEach(this.destroyResource);
    this.acquiredResources.forEach(this.destroyResource);
  }
}
