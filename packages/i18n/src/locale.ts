export function regionFromLocale(locale: string): string | undefined {
  const code = locale.split('-')[1];
  return code && code.toUpperCase();
}

export function languageFromLocale(locale: string) {
  return locale.split('-')[0].toLowerCase();
}
