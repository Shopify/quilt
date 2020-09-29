class MessagePortPolyfill implements MessagePort {
  onmessage: EventListener | null = null;
  onmessageerror: EventListener | null = null;

  otherPort!: MessagePortPolyfill;
  private listeners = new Set<EventListener>();

  dispatchEvent(event: Event) {
    if (this.onmessage) {
      this.onmessage(event);
    }

    for (const listener of this.listeners) {
      listener(event);
    }

    return true;
  }

  postMessage(message: any) {
    if (!this.otherPort) {
      return;
    }

    this.otherPort.dispatchEvent({data: message} as any);
  }

  addEventListener(type: string, listener: EventListener) {
    if (type !== 'message') {
      return;
    }

    this.listeners.add(listener);
  }

  removeEventListener(type: string, listener: EventListener) {
    if (type !== 'message') {
      return;
    }

    this.listeners.delete(listener);
  }

  start() {}
  close() {}
}

class MessageChannelPolyfill implements MessageChannel {
  readonly port1: MessagePortPolyfill;
  readonly port2: MessagePortPolyfill;

  constructor() {
    this.port1 = new MessagePortPolyfill();
    this.port2 = new MessagePortPolyfill();
    this.port1.otherPort = this.port2;
    this.port2.otherPort = this.port1;
  }
}

export {MessageChannelPolyfill as MessageChannel};
