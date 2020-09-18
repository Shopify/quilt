function pruneUndefinedFields(obj = {}) {
  const objCopy = {...obj};

  Object.keys(objCopy).forEach(
    key => objCopy[key] === undefined && delete objCopy[key],
  );

  return objCopy;
}

export function combinedI18nDetails(details, overrides) {
  return {
    locale: overrides.fallbackLocale || 'en',
    ...pruneUndefinedFields(details),
    ...pruneUndefinedFields(overrides),
  };
}
