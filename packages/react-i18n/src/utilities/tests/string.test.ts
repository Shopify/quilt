import {convertFirstSpaceToNonBreakingSpace} from '../string';

describe('convertFirstSpaceToNonBreakingSpace()', () => {
  it('converts first space into non breaking spaces', () => {
    expect(convertFirstSpaceToNonBreakingSpace('8:30 am PST')).toBe(
      `8:30\u00A0am PST`,
    );
  });
});
