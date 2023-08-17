type Locale = 'th' | 'ko' | 'ja';

export function getGraphemes({
  text,
  locale,
}: {
  text?: string;
  locale: Locale;
}): string[] | undefined {
  // returns undefined when Intl.Segmenter does not exist in our JS environment (such as in Firefox)
  if (!text || !Intl.Segmenter) {
    return undefined;
  }

  const segmenter = new Intl.Segmenter(locale, {
    granularity: 'grapheme',
  });
  return Array.from(segmenter.segment(text)).map(
    (grapheme) => grapheme.segment,
  );
}
