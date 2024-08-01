import {graphql as rollupGraphQL} from './rollup';

export function graphql(...args: Parameters<typeof rollupGraphQL>) {
  return {...rollupGraphQL(...args), enforce: 'pre' as const};
}
