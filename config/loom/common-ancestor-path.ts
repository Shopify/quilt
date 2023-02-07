/* eslint-disable id-length, no-nested-ternary, no-negated-condition */
import {parse, sep, normalize} from 'path';

function* commonArrayMembers(a, b) {
  const [l, s] = a.length > b.length ? [a, b] : [b, a];
  for (const x of s) {
    if (x === l.shift()) yield x;
    else break;
  }
}

export function findCommonAncestorPath(...paths) {
  return paths.reduce((a, b) =>
    a === b
      ? a
      : parse(a).root !== parse(b).root
      ? null
      : [
          ...commonArrayMembers(
            normalize(a).split(sep),
            normalize(b).split(sep),
          ),
        ].join(sep),
  );
}
