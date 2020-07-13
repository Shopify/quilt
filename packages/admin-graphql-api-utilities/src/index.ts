const GID_TYPE_REGEXP = /^gid:\/\/[\w-]+\/([\w-]+)\//;
const GID_REGEXP = /\/(\w[\w-]*)(?:\?([\w-]+=[\w-]+(&[\w-]+=[\w-]+)*))*$/;

interface ParsedGID {
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

export function parseGidWithParams(gid: string): ParsedGID {
  // appends forward slash to help identify invalid id
  const id = `/${gid}`;
  const matches = GID_REGEXP.exec(id);
  if (matches && matches[1] !== undefined) {
    const params =
      matches[2] === undefined
        ? {}
        : matches[2]
            .split('&')
            .reduce<Record<string, string>>((acc, keyVal) => {
              const [key, value] = keyVal.split('=');
              acc[key] = value;
              return acc;
            }, {});

    return {
      id: matches[1],
      params,
    };
  }
  throw new Error(`Invalid gid: ${gid}`);
}

export function createComposeGidFunction(namescape: string) {
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

    const queryParams = paramKeys
      .map(query => {
        if (params[query] == null) {
          return null;
        }

        return `${query}=${params[query]}`;
      })
      .filter(Boolean)
      .join('&');

    return `${gid}?${queryParams}`;
  };
}

export const composeGid = createComposeGidFunction('shopify');

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
