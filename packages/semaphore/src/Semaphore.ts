export class Permit {
  private onRelease: () => void;
  private isReleased: boolean = false;

  constructor(onRelease: () => void) {
    this.onRelease = onRelease;
  }

  release() {
    if (!this.isReleased) {
      this.isReleased = true;
      this.onRelease();
    }
  }
}

export class Semaphore {
  private availablePermits: number;
  private deferreds: {resolve(permit: Permit): void}[] = [];

  constructor(count: number) {
    this.availablePermits = count;
  }

  acquire(): Promise<Permit> {
    if (this.availablePermits > 0) {
      this.availablePermits--;
      return Promise.resolve(this.createPermit());
    } else {
      return new Promise((resolve) => this.deferreds.push({resolve}));
    }
  }

  private createPermit(): Permit {
    return new Permit(() => {
      this.availablePermits++;

      if (this.deferreds.length) {
        this.deferreds.shift()!.resolve(this.createPermit());
      }
    });
  }
}
