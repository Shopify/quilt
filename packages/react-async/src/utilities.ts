import {Import} from '@shopify/async';

export function normalize(module: any) {
  if (module == null) {
    return null;
  }

  const value = 'default' in module ? module.default : module;
  return value == null ? null : value;
}

export async function resolve<T>(load: () => Promise<Import<T>>): Promise<T> {
  try {
    const resolved = await load();
    return normalize(resolved);
  } catch (error) {
    throw error;
  }
}
