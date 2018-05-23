export type Key = AlphabetKey | MiscKey | ModifierKey;

export type AlphabetKey =
  | 'a'
  | 'b'
  | 'c'
  | 'd'
  | 'e'
  | 'f'
  | 'g'
  | 'h'
  | 'i'
  | 'j'
  | 'k'
  | 'l'
  | 'm'
  | 'n'
  | 'o'
  | 'p'
  | 'q'
  | 'r'
  | 's'
  | 't'
  | 'u'
  | 'v'
  | 'w'
  | 'x'
  | 'y'
  | 'z';

export type MiscKey = '?' | '+' | '-' | 'Enter' | 'Tab' | 'Escape';

export type ModifierKey = 'shiftKey' | 'ctrlKey' | 'metaKey' | 'altKey';
