const GID_REGEXP = /\/(\w+(-\w+)*)$/;

export function parseGid(gid: string): string {
  // appends forward slash to help identify invalid id
  const id = `/${gid}`;
  const matches = id.match(GID_REGEXP);
  if (matches && matches[1] !== undefined) {
    return matches[1];
  }
  throw new Error(`Invalid gid: ${gid}`);
}

export function composeGid(key: string, id: number | string): string {
  return `gid://shopify/${key}/${id}`;
}

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
