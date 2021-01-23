import {pseudotranslate} from '../pseudotranslate';

describe('pseudotranslate()', () => {
  it('changes all ASCII characters', () => {
    const pseudo = pseudotranslate('cat');
    expect(pseudo).not.toContain('c');
    expect(pseudo).not.toContain('a');
    expect(pseudo).not.toContain('t');
  });

  describe('prepend', () => {
    it('is prepended to the pseudotranslated string', () => {
      expect(pseudotranslate('cat', {prepend: '%%'}).startsWith('%%')).toBe(
        true,
      );
    });
  });

  describe('append', () => {
    it('is appended to the pseudotranslated string', () => {
      expect(pseudotranslate('cat', {append: '%%'}).endsWith('%%')).toBe(true);
    });
  });

  describe('delimiters', () => {
    it('does not replace words in delimiters', () => {
      const pseudo = pseudotranslate('Hello, {name}. Have a great {day}', {
        startDelimiter: '{',
        endDelimiter: '}',
      });
      expect(pseudo).toContain('name');
      expect(pseudo).toContain('day');
    });

    it('does not break strings without delimiters', () => {
      const pseudoWithoutDelimiter = pseudotranslate('cat');
      const pseudoWithDelimiter = pseudotranslate('cat', {
        startDelimiter: '{',
        endDelimiter: '}',
      });
      expect(pseudoWithoutDelimiter).toBe(pseudoWithDelimiter);
    });

    it('uses the delimiter as both start and end', () => {
      expect(
        pseudotranslate('Hello, $name$.', {
          delimiter: '$',
        }),
      ).toContain('name');
    });

    it('handles multi-character, regex-meaningful delimiters', () => {
      expect(
        pseudotranslate('Hello, $$name$$.', {
          delimiter: '$$',
        }),
      ).toContain('name');
    });
  });

  describe('length', () => {
    it('produces a slightly longer string with repeated characters by default', () => {
      const pseudo = pseudotranslate('dogs');
      expect(pseudo).toHaveLength(5);
      expect([...new Set([...pseudo])]).toHaveLength(4);
    });

    it('does not duplicate whitespace characters', () => {
      const pseudo = pseudotranslate('c a');
      expect(pseudo).toHaveLength(4);
      expect([...pseudo].filter(character => character === ' ')).toHaveLength(
        1,
      );
    });

    it('does not duplicate characters without replacements', () => {
      expect(pseudotranslate('<>')).toBe('<>');
    });

    it('produces a 0.5x length string for Chinese', () => {
      const pseudo = pseudotranslate('headphones', {
        toLocale: 'zh',
      });
      expect(pseudo).toHaveLength(5);
    });

    it('produces a 0.5x length string for Japanese', () => {
      const pseudo = pseudotranslate('headphones', {
        toLocale: 'ja',
      });
      expect(pseudo).toHaveLength(5);
    });

    it('produces a 0.8x length string for Korean', () => {
      const pseudo = pseudotranslate('headphones', {
        toLocale: 'ko',
      });
      expect(pseudo).toHaveLength(8);
    });

    it('produces a 1.5x length string for German', () => {
      const pseudo = pseudotranslate('headphones', {
        toLocale: 'de',
      });
      expect(pseudo).toHaveLength(15);
    });

    it('produces a 1.5x length string for Dutch', () => {
      const pseudo = pseudotranslate('headphones', {
        toLocale: 'nl',
      });
      expect(pseudo).toHaveLength(15);
    });

    it('produces a 1.3x length string for French', () => {
      const pseudo = pseudotranslate('headphones', {
        toLocale: 'fr',
      });
      expect(pseudo).toHaveLength(13);
    });

    it('strips out the country code if provided', () => {
      const pseudo = pseudotranslate('headphones', {
        toLocale: 'fr-CA',
      });
      expect(pseudo).toHaveLength(13);
    });

    it('produces a 1.3x length string for Italian', () => {
      const pseudo = pseudotranslate('headphones', {
        toLocale: 'it',
      });
      expect(pseudo).toHaveLength(13);
    });
  });
});
