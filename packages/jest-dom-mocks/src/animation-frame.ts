interface FrameCallback {
  (time: number): any;
}

export default class AnimationFrame {
  private isUsingMockAnimationFrame = false;
  private queued: {[key: number]: FrameCallback} = {};
  private originalRequestAnimationFrame: any;
  private originalCancelAnimationFrame: any;
  private currentAnimationFrame = 0;

  mock() {
    if (this.isUsingMockAnimationFrame) {
      throw new Error(
        'The animation frame is already mocked, but you tried to mock it again.',
      );
    }

    this.isUsingMockAnimationFrame = true;

    this.originalRequestAnimationFrame = window.requestAnimationFrame;
    window.requestAnimationFrame = this.requestAnimationFrame;

    this.originalCancelAnimationFrame = window.cancelAnimationFrame;
    window.cancelAnimationFrame = this.cancelAnimationFrame;
  }

  restore() {
    if (!this.isUsingMockAnimationFrame) {
      throw new Error(
        'The animation frame is already real, but you tried to restore it again.',
      );
    }

    this.isUsingMockAnimationFrame = false;

    window.requestAnimationFrame = this.originalRequestAnimationFrame;
    window.cancelAnimationFrame = this.originalCancelAnimationFrame;
  }

  isMocked() {
    return this.isUsingMockAnimationFrame;
  }

  runFrame() {
    this.ensureAnimationFrameIsMock();
    // We need to do it this way so that frames that queue other frames
    // don't get removed
    Object.keys(this.queued).forEach((frame: any) => {
      const callback = this.queued[frame];
      delete this.queued[frame];
      callback(Date.now());
    });
  }

  private requestAnimationFrame = (callback: FrameCallback): number => {
    this.currentAnimationFrame += 1;
    this.queued[this.currentAnimationFrame] = callback;
    return this.currentAnimationFrame;
  };

  private cancelAnimationFrame = (frame: number) => {
    delete this.queued[frame];
  };

  private ensureAnimationFrameIsMock() {
    if (!this.isUsingMockAnimationFrame) {
      throw new Error(
        'You must call animationFrame.mock() before interacting with the mock request- or cancel- AnimationFrame methods.',
      );
    }
  }
}
