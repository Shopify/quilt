import {languageFromLocale} from './locale';

export interface PseudotranslateOptions {
  prepend?: string;
  append?: string;
  startDelimiter?: string;
  endDelimiter?: string;
  delimiter?: string;
  toLocale?: string;
}

const LETTERS = new Map<string, string>([
  ['a', 'α'],
  ['b', 'ḅ'],
  ['c', 'ͼ'],
  ['d', 'ḍ'],
  ['e', 'ḛ'],
  ['f', 'ϝ'],
  ['g', 'ḡ'],
  ['h', 'ḥ'],
  ['i', 'ḭ'],
  ['j', 'ĵ'],
  ['k', 'ḳ'],
  ['l', 'ḽ'],
  ['m', 'ṃ'],
  ['n', 'ṇ'],
  ['o', 'ṓ'],
  ['p', 'ṗ'],
  ['q', 'ʠ'],
  ['r', 'ṛ'],
  ['s', 'ṡ'],
  ['t', 'ṭ'],
  ['u', 'ṵ'],
  ['v', 'ṽ'],
  ['w', 'ẁ'],
  ['x', 'ẋ'],
  ['y', 'ẏ'],
  ['z', 'ẓ'],
  ['A', 'Ḁ'],
  ['B', 'Ḃ'],
  ['C', 'Ḉ'],
  ['D', 'Ḍ'],
  ['E', 'Ḛ'],
  ['F', 'Ḟ'],
  ['G', 'Ḡ'],
  ['H', 'Ḥ'],
  ['I', 'Ḭ'],
  ['J', 'Ĵ'],
  ['K', 'Ḱ'],
  ['L', 'Ḻ'],
  ['M', 'Ṁ'],
  ['N', 'Ṅ'],
  ['O', 'Ṏ'],
  ['P', 'Ṕ'],
  ['Q', 'Ǫ'],
  ['R', 'Ṛ'],
  ['S', 'Ṣ'],
  ['T', 'Ṫ'],
  ['U', 'Ṳ'],
  ['V', 'Ṿ'],
  ['W', 'Ŵ'],
  ['X', 'Ẋ'],
  ['Y', 'Ŷ'],
  ['Z', 'Ż'],
]);

const DEFAULT_RATIO = 1.15;
const LOCALE_RATIOS = new Map([
  ['zh', 0.5],
  ['ja', 0.5],
  ['ko', 0.8],
  ['fr', 1.3],
  ['it', 1.3],
  ['de', 1.5],
  ['nl', 1.5],
]);

export function sizeRatio({to: locale}: {to?: string}) {
  if (locale == null) {
    return DEFAULT_RATIO;
  }

  return (
    LOCALE_RATIOS.get(locale) ||
    LOCALE_RATIOS.get(languageFromLocale(locale)) ||
    DEFAULT_RATIO
  );
}

export function pseudotranslate(
  string: string,
  {
    delimiter,
    startDelimiter = delimiter,
    endDelimiter = delimiter,
    prepend,
    append,
    toLocale,
  }: PseudotranslateOptions = {},
) {
  const parts = createParts(string, {startDelimiter, endDelimiter});

  const adjustableCharacters = parts.reduce<number>(
    (sum, part) =>
      typeof part === 'string' ? sum + countAdjustableCharacters(part) : sum,
    0,
  );

  const charactersToAdjust =
    Math.ceil(adjustableCharacters * sizeRatio({to: toLocale})) -
    adjustableCharacters;
  const adjustEvery = adjustableCharacters / Math.abs(charactersToAdjust);
  let adjustAt = adjustEvery;
  let adjustableCharacterIndex = -1;

  const pseudotranslated = parts.reduce<string>((pseudotranslated, part) => {
    const pseudotranslatedPart =
      typeof part === 'string'
        ? [...part]
            .map((character) => {
              const isAdjustable = isAdjustableCharacter(character);

              if (isAdjustable) {
                adjustableCharacterIndex++;
              }

              const newCharacter = LETTERS.get(character) || character;
              const shouldAdjust =
                isAdjustable &&
                adjustableCharacterIndex + 1 === Math.floor(adjustAt);

              if (shouldAdjust) {
                adjustAt += adjustEvery;
                return charactersToAdjust < 0 ? '' : newCharacter.repeat(2);
              } else {
                return newCharacter;
              }
            })
            .join('')
        : part[0];

    return pseudotranslated + pseudotranslatedPart;
  }, '');

  return `${prepend || ''}${pseudotranslated}${append || ''}`;
}

function isAdjustableCharacter(character: string) {
  return LETTERS.has(character);
}

function countAdjustableCharacters(string: string) {
  return [...string].filter(isAdjustableCharacter).length;
}

function createParts(
  string: string,
  {
    startDelimiter,
    endDelimiter,
  }: Pick<PseudotranslateOptions, 'startDelimiter' | 'endDelimiter'>,
) {
  const delimiterRegex =
    startDelimiter && endDelimiter
      ? createDelimiterRegex(startDelimiter, endDelimiter)
      : undefined;

  let lastTokenEndIndex = 0;
  const parts: (RegExpExecArray | string)[] = [];

  if (delimiterRegex) {
    let token = delimiterRegex.exec(string);

    while (token) {
      parts.push(string.substring(lastTokenEndIndex, token.index));
      parts.push(token);

      lastTokenEndIndex = token.index + token[0].length;
      token = delimiterRegex.exec(string);
    }

    parts.push(string.substring(lastTokenEndIndex, string.length));
  } else {
    parts.push(string);
  }

  return parts;
}

function createDelimiterRegex(startDelimiter: string, endDelimiter: string) {
  if (startDelimiter.length === 1 && endDelimiter.length === 1) {
    return new RegExp(
      `\\${startDelimiter}[^\\${endDelimiter}]*\\${endDelimiter}`,
      'g',
    );
  }

  const escapedStart = [...startDelimiter]
    .map((character) => `\\${character}`)
    .join('');
  const escapedEnd = [...endDelimiter]
    .map((character) => `\\${character}`)
    .join('');

  return new RegExp(`${escapedStart}.*?${escapedEnd}`, 'g');
}
