type ReleaseCallback = () => Promise<any>;

export class Permit {
  private onRelease: ReleaseCallback;
  private isReleased = false;

  constructor(onRelease: ReleaseCallback) {
    this.onRelease = onRelease;
  }

  async release() {
    if (!this.isReleased) {
      this.isReleased = true;
      await this.onRelease();
    }
  }
}

type Deferred = {
  resolve?(permit: Permit): void;
  promise?: Promise<Permit>;
};

export class Semaphore {
  private availablePermits: number;
  private deferreds: Deferred[] = [];

  constructor(count: number) {
    this.availablePermits = count;
  }

  acquire(): Promise<Permit> {
    if (this.availablePermits > 0) {
      this.availablePermits--;
      return Promise.resolve(this.createPermit());
    } else {
      const deferred: Deferred = {};
      deferred.promise = new Promise(resolve => {
        deferred.resolve = resolve;
      });
      this.deferreds.push(deferred);
      return deferred.promise;
    }
  }

  private createPermit(): Permit {
    return new Permit(
      async (): Promise<any> => {
        this.availablePermits++;

        if (this.deferreds.length) {
          const deferred = this.deferreds.shift()!;
          deferred.resolve!(this.createPermit());
          await deferred.promise;
        }
      },
    );
  }
}
