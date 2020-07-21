const GID_TYPE_REGEXP = /^gid:\/\/[\w-]+\/([\w-]+)\//;
const GID_REGEXP = /\/(\w[\w-]*)(?:\?(.*))*$/;

interface ParsedGid {
  id: string;
  params: Record<string, string>;
}

export function parseGidType(gid: string): string {
  const matches = GID_TYPE_REGEXP.exec(gid);

  if (matches && matches[1] !== undefined) {
    return matches[1];
  }
  throw new Error(`Invalid gid: ${gid}`);
}

export function parseGid(gid: string): string {
  // prepends forward slash to help identify invalid id
  const id = `/${gid}`;
  const matches = GID_REGEXP.exec(id);
  if (matches && matches[1] !== undefined) {
    return matches[1];
  }
  throw new Error(`Invalid gid: ${gid}`);
}

export function parseGidWithParams(gid: string): ParsedGid {
  // appends forward slash to help identify invalid id
  const id = `/${gid}`;
  const matches = GID_REGEXP.exec(id);
  if (matches && matches[1] !== undefined) {
    const params =
      matches[2] === undefined
        ? {}
        : fromEntries(new URLSearchParams(matches[2]).entries());

    return {
      id: matches[1],
      params,
    };
  }
  throw new Error(`Invalid gid: ${gid}`);
}

export function composeGidFactory(namescape: string) {
  return function composeGid(
    key: string,
    id: number | string,
    params: Record<string, string> = {},
  ): string {
    const gid = `gid://${namescape}/${key}/${id}`;
    const paramKeys = Object.keys(params);

    if (paramKeys.length === 0) {
      return gid;
    }

    const paramString = new URLSearchParams(params).toString();
    return `${gid}?${paramString}`;
  };
}

export const composeGid = composeGidFactory('shopify');

interface Edge<T> {
  node: T;
}

export function nodesFromEdges<T>(edges: Edge<T>[]): T[] {
  return edges.map(({node}) => node);
}

export function keyFromEdges<T, K extends keyof T>(
  edges: Edge<T>[],
  key: K,
): T[K][] {
  return edges.map(({node}) => node[key]);
}

// Once we update to Node 12, we can drop this helper to use `Object.fromEntries` instead.
function fromEntries<K extends string, T>(entries: IterableIterator<[K, T]>) {
  const obj = {} as Record<K, T>;
  for (const [key, val] of entries) {
    obj[key] = val;
  }
  return obj;
}
