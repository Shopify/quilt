import {identifyScripts} from '../identifyScripts';
import {UnicodeCharacterSet} from '../../constants';

describe('identifyScripts', () => {
  it('identifies English as Latin script', () => {
    expect(identifyScripts('Hello my name Mike')).toStrictEqual([
      UnicodeCharacterSet.Latin,
    ]);
  });

  it('identifies other Latin based language (Czech) as latin script', () => {
    expect(identifyScripts('rád nakupuji')).toStrictEqual([
      UnicodeCharacterSet.Latin,
    ]);
  });

  it('identifies Chinese script', () => {
    expect(identifyScripts('我喜欢购物')).toStrictEqual([
      UnicodeCharacterSet.Han,
    ]);
  });

  it('identifies Japanese script (Han, Hiragana and Katakana)', () => {
    expect(
      identifyScripts('素早い茶色のキツネが怠け者の犬を飛び越えます。').sort(),
    ).toStrictEqual(
      [
        UnicodeCharacterSet.Han,
        UnicodeCharacterSet.Hiragana,
        UnicodeCharacterSet.Katakana,
      ].sort(),
    );
  });

  it('identifies Korean script', () => {
    expect(identifyScripts('한국인')).toStrictEqual([
      UnicodeCharacterSet.Hangul,
    ]);
  });

  it('identifies Thai script', () => {
    expect(identifyScripts('แบบไทย')).toStrictEqual([UnicodeCharacterSet.Thai]);
  });

  it('identifies no scripts if empty string', () => {
    expect(identifyScripts('')).toStrictEqual([]);
  });

  it('identifies no scripts if unsupported script', () => {
    expect(identifyScripts('מיכאל')).toStrictEqual([]);
  });
});
