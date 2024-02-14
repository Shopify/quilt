export function languageFromLocale(locale: string) {
  return locale.split('-')[0].toLowerCase();
}
