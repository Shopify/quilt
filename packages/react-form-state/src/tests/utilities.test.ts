import {asChoiceField, set} from '../utilities';

describe('utilities', () => {
  describe('set', () => {
    it("sets nested values when intermediary objects don't exist", () => {
      const root = {};
      const updated = set(root, ['ab', 'cd'], 'ef');
      expect(updated).toMatchObject({
        ab: {
          cd: 'ef',
        },
      });
    });
  });

  describe('asChoiceField()', () => {
    it('replaces value with checked', () => {
      expect(asChoiceField({value: true} as any)).toMatchObject({
        checked: true,
      });
    });
  });
});
