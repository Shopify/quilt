import contrast from '../contrast';

describe('contrast', () => {
  it('returns a high contrast value when the first argument is darker than the second argument', () => {
    const contrastOfColor = contrast('#fff', '#000');
    expect(contrastOfColor).toEqual(21);
  });

  it('returns a low contrast when the colors are closed', () => {
    const contrastOfColor = contrast('#000', '#000');
    expect(contrastOfColor).toEqual(1);
  });
});
