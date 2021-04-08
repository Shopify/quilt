import type {BuildWebAppTargetOptions} from '@sewing-kit/hooks';

export function idFromTargetOptions(options: BuildWebAppTargetOptions) {
  return (
    Object.keys(options)
      .sort()
      .map((key) => {
        const value = (options as any)[key];

        switch (key as keyof typeof options) {
          case 'quiltAutoServer':
            return undefined;
          case 'browsers':
            return value;
          default: {
            if (typeof value === 'boolean') {
              return value ? key : `no-${key}`;
            }

            return value;
          }
        }
      })
      .filter(Boolean)
      .join('.') || 'default'
  );
}

export function excludeNonPolyfillEntries(
  entries: string[] | readonly string[],
) {
  return entries.filter((entry) => entry.includes('@quilted/polyfills'));
}
