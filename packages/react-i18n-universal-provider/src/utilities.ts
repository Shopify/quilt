function pruneUndefinedFields(obj = {}) {
  Object.keys(obj).forEach(key => obj[key] === undefined && delete obj[key]);

  return obj;
}

export function combinedI18nDetails(details, overrides) {
  return {
    locale: overrides.fallbackLocale || 'en',
    ...pruneUndefinedFields(details),
    ...pruneUndefinedFields(overrides),
  };
}
