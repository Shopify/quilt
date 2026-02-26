import serialize from 'serialize-javascript';
import {getSerialized, serializedID} from '../utilities';

describe('getSerialized()', () => {
  let spy: jest.SpyInstance;

  beforeEach(() => {
    spy = jest.spyOn(document, 'getElementById');
  });

  afterEach(() => {
    spy.mockRestore();
  });

  it('queries for the serialized ID', () => {
    spy.mockReturnValue(createFakeSerializedNode());
    getSerialized('MyData');
    expect(spy).toHaveBeenCalledWith(serializedID('MyData'));
  });

  it('throws if no node is found matching the ID', () => {
    spy.mockReturnValue(null);
    expect(() => getSerialized('MyData')).toThrowError(
      expect.objectContaining({
        message: expect.stringContaining('MyData'),
      }),
    );
  });

  it('returns the deserialized data', () => {
    const data = {foo: 'window.location = "http://dangerous.com"'};
    spy.mockReturnValue(createFakeSerializedNode(data));
    expect(getSerialized('MyData').data).toMatchObject(data);
  });

  it('returns the empty details when none were provided', () => {
    spy.mockReturnValue(createFakeSerializedNode());
    expect(getSerialized('MyData').details).toEqual({});
  });

  it('returns the deserialized details', () => {
    const details = {foo: 'window.location = "http://dangerous.com"'};
    spy.mockReturnValue(createFakeSerializedNode({}, details));
    expect(getSerialized('MyData').details).toMatchObject(details);
  });
});

function createFakeSerializedNode(data: any = {}, details?: any) {
  return {
    innerHTML: serialize(data),
    dataset: details ? {serializedDetails: serialize(details)} : {},
  };
}
