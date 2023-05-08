/**
 * Matches a GID and captures the following groups:
 * 1. The namespace
 * 2. The type
 * 3. The ID
 * 4. The query string (if any)
 *
 * @see https://regex101.com/r/5j5AXK
 */
const GID_REGEX =
  /^gid:\/\/([a-zA-Z][a-zA-Z0-9-]*)\/([a-zA-Z][\w-]*)\/(\w[\w-]*)(\?.*)?$/;

export type Gid<
  Namespace extends string,
  Type extends string,
> = `gid://${Namespace}/${Type}/${number | string}`;

export type ShopifyGid<T extends string> = Gid<'shopify', T>;

interface ParsedGid {
  id: string;
  params: {[key: string]: string};
}

export interface GidObject {
  namespace: string;
  type: string;
  id: string;
  queryString?: string;
}

/**
 * Attempts to parse a string into a GID object.
 *
 * @throws {Error} If the string is not a valid GID.
 */
export function parseGidObject(gid: string): GidObject {
  const matches = GID_REGEX.exec(gid);

  if (matches) {
    return {
      namespace: matches[1],
      type: matches[2],
      id: matches[3],
      queryString: matches[4],
    };
  }

  throw new Error(`Invalid gid: ${gid}`);
}

export function parseGidType(gid: string): string {
  return parseGidObject(gid).type;
}

export function parseGid(gid: string): string {
  return parseGidObject(gid).id;
}

export function parseGidWithParams(gid: string): ParsedGid {
  const obj = parseGidObject(gid);
  return {
    id: obj.id,
    params:
      obj.queryString === undefined
        ? {}
        : fromEntries(new URLSearchParams(obj.queryString).entries()),
  };
}

export function composeGidFactory<N extends string>(namespace: N) {
  return function composeGid<T extends string>(
    key: T,
    id: number | string,
    params: {[key: string]: string} = {},
  ): Gid<N, T> {
    const gid = `gid://${namespace}/${key}/${id}`;
    const paramKeys = Object.keys(params);

    if (paramKeys.length === 0) {
      return gid as Gid<N, T>;
    }

    const paramString = new URLSearchParams(params).toString();
    return `${gid}?${paramString}` as Gid<N, T>;
  };
}

export const composeGid = composeGidFactory('shopify');

export function isGidFactory<N extends string>(namespace: N) {
  return function isGid<T extends string = string>(
    gid: string,
    type?: T,
  ): gid is Gid<N, T> {
    try {
      const obj = parseGidObject(gid);
      return (
        obj.namespace === namespace &&
        (type === undefined || obj.type === type) &&
        obj.id.length > 0
      );
    } catch {
      return false;
    }
  };
}

export const isGid = isGidFactory('shopify');

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
  const obj = {} as {[key in K]: T};
  for (const [key, val] of entries) {
    obj[key] = val;
  }
  return obj;
}
