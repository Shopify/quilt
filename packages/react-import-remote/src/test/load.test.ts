import {noop} from '@shopify/javascript-utilities/other';
import load, {clearCache} from '../load';

describe('load()', () => {
  const mockURL = 'https://foo.com/bar.js';

  beforeEach(() => {
    clearCache();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('creates a script tag with the provided source', async () => {
    const {script, create, append} = spyOnDOM();
    const promise = load(mockURL, noop);

    script.triggerEvent('load');
    await promise;

    expect(create).toHaveBeenCalledWith('script');
    expect(append).toHaveBeenCalledWith(script);
    expect(script.setAttribute).toHaveBeenCalledWith('src', mockURL);
  });

  it('rejects when the script errors', async () => {
    const {script} = spyOnDOM();
    const promise = load(mockURL, noop);

    script.triggerEvent('error');

    await expect(promise).rejects.toEqual(expect.anything());
  });

  it('calls the getImport() parameter with the window once the script has loaded', async () => {
    const spy = jest.fn();
    const {script} = spyOnDOM();
    const promise = load(mockURL, spy);

    expect(spy).not.toHaveBeenCalled();

    script.triggerEvent('load');
    await promise;

    expect(spy).toHaveBeenCalledWith(window);
  });

  it('resolves with the value returned from getImport()', async () => {
    const returnValue = 'foo';
    const spy = jest.fn(() => returnValue);
    const {script} = spyOnDOM();
    const promise = load(mockURL, spy);

    script.triggerEvent('load');
    expect(await promise).toBe(returnValue);
  });

  it('uses cached values when they are available', async () => {
    const returnValue = 'foo';
    const spy = jest.fn(() => returnValue);
    const {script} = spyOnDOM();
    const promise = load(mockURL, spy);

    script.triggerEvent('load');
    expect(await promise).toBe(returnValue);
    expect(await load(mockURL, spy)).toBe(returnValue);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('does not attach multiple script tags when in the process of resolving', async () => {
    const returnValue = 'foo';
    const spy = jest.fn(() => returnValue);
    const {script, create, append} = spyOnDOM();

    const promiseOne = load(mockURL, spy);
    const promiseTwo = load(mockURL, spy);

    script.triggerEvent('load');
    await Promise.all([promiseOne, promiseTwo]);
    expect(create).toHaveBeenCalledTimes(1);
    expect(append).toHaveBeenCalledTimes(1);
  });

  it('does not attach multiple script tags when after erroring out', async () => {
    const returnValue = 'foo';
    const spy = jest.fn(() => returnValue);
    const {script, create, append} = spyOnDOM();

    const promiseOne = load(mockURL, spy);

    script.triggerEvent('error');
    try {
      await promiseOne;
      // eslint-disable-next-line no-empty
    } catch (_) {}

    try {
      await load(mockURL, spy);
      // eslint-disable-next-line no-empty
    } catch (_) {}

    expect(create).toHaveBeenCalledTimes(1);
    expect(append).toHaveBeenCalledTimes(1);
  });

  it('removes listeners when the script has loaded', async () => {
    const {script} = spyOnDOM();
    const promise = load(mockURL, noop);

    script.triggerEvent('load');
    await promise;

    for (const call of script.addEventListener.mock.calls) {
      expect(script.removeEventListener).toHaveBeenCalledWith(...call);
    }
  });

  it('removes listeners when the script has errored', async () => {
    const {script} = spyOnDOM();
    const promise = load(mockURL, noop);

    script.triggerEvent('error');
    try {
      await promise;
      // eslint-disable-next-line no-empty
    } catch (_) {}

    for (const call of script.addEventListener.mock.calls) {
      expect(script.removeEventListener).toHaveBeenCalledWith(...call);
    }
  });
});

function spyOnDOM() {
  const script = fakeScript();

  return {
    script,
    create: jest
      .spyOn(document, 'createElement')
      .mockImplementation(() => script),
    append: jest.spyOn(document.head, 'appendChild').mockImplementation(noop),
  };
}

function fakeScript() {
  const events = {
    load: new Set<Function>(),
    error: new Set<Function>(),
  };

  return {
    setAttribute: jest.fn(),
    removeEventListener: jest.fn(
      (event: keyof typeof events, callback: Function) => {
        events[event].delete(callback);
      },
    ),
    addEventListener: jest.fn(
      (event: keyof typeof events, callback: Function) => {
        events[event].add(callback);
      },
    ),
    triggerEvent(event: 'load' | 'error') {
      events[event].forEach(callback =>
        callback(event === 'load' ? {} : new Error()),
      );
    },
  };
}
