import {TranslationDictionary} from '../types';

import {translate} from './translate';

export function wrapWithDisclaimer(
  content: string,
  language: string,
  translations: TranslationDictionary | TranslationDictionary[],
  locale: string,
): string {
  const scope = 'disclaimer.language';
  return translate(
    language,
    {scope, replacements: {content}},
    translations,
    locale,
  );
}
