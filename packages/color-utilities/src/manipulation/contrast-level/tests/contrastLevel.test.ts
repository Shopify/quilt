import contrastLevel from '../contrastLevel';
import {wcagLevel} from '@types';

describe('contrastLevel', () => {
  it('returns AAA for high constrast', () => {
    const contrastRatio = contrastLevel('#fff', '#000');
    expect(contrastRatio).toEqual(wcagLevel.AAA);
  });

  it('returns AA for medium contrast', () => {
    const contrastRatio = contrastLevel('#000', '#888');
    expect(contrastRatio).toEqual(wcagLevel.AA);
  });

  it('returns A for low constrast', () => {
    const contrastRatio = contrastLevel('#000', '#000');
    expect(contrastRatio).toEqual(wcagLevel.A);
  });
});
