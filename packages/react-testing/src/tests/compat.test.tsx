import {getInternals} from '../compat';
import {ReactInstance} from '../types';

describe('compat', () => {
  it('returns the fiber for react-16 style nodes', () => {
    const fakeInstance: ReactInstance = {_reactInternalFiber: 'foo'} as any;
    expect(getInternals(fakeInstance)).toBe('foo');
  });

  it('returns the fiber for react-17 style nodes', () => {
    const fakeInstance: ReactInstance = {_reactInternals: 'foo'} as any;
    expect(getInternals(fakeInstance)).toBe('foo');
  });
});
