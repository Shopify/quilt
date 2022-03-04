/* eslint-disable id-length */
import {expectAssignable, expectNotAssignable} from 'tsd';

import {DeepOmitOptional} from '../build/ts/types';

interface Simple {
  req: string;
  opt?: string;
}

expectAssignable<DeepOmitOptional<Simple>>({
  req: '',
});

expectNotAssignable<DeepOmitOptional<Simple>>({});

interface Nested {
  req: Simple;
  opt?: Simple;
}

expectAssignable<DeepOmitOptional<Nested>>({
  req: {req: ''},
});

expectNotAssignable<DeepOmitOptional<Nested>>({
  opt: {opt: '', req: ''},
  req: {opt: '', req: ''},
});

interface Complex {
  union: string | number;
  nullUnion: string | null;
  unefUnion: string | undefined;
  listUnion: (string | number)[];
  intersect: {a: string; b?: string} & {c: string; d?: string};
  intersectingUnion: {a: string | null} & {a: string | number};
}

const complex: DeepOmitOptional<Complex> = {
  union: '',
  nullUnion: null,
  unefUnion: undefined,
  listUnion: [2, ''],
  intersect: {a: '', c: ''},
  intersectingUnion: {a: ''},
};

expectAssignable<DeepOmitOptional<Complex>>(complex);

expectNotAssignable<DeepOmitOptional<Complex>>({
  ...complex,
  intersectingUnion: {a: null},
});

expectNotAssignable<DeepOmitOptional<Complex>>({
  ...complex,
  intersect: {a: '', b: '', c: '', d: ''},
});

interface NestedComplex {
  req: Complex;
  opt?: Complex;
}

expectAssignable<DeepOmitOptional<NestedComplex>>({
  req: complex,
});

expectNotAssignable<DeepOmitOptional<NestedComplex>>({
  req: complex,
  opt: complex,
});

interface SimpleList {
  req: Simple[];
  opt?: Simple[];
}

expectAssignable<DeepOmitOptional<SimpleList>>({
  req: [{req: ''}],
});

expectNotAssignable<DeepOmitOptional<SimpleList>>({
  req: [{req: '', opt: ''}],
  opt: [{req: '', opt: ''}],
});

interface ReadOnlyList {
  req: ReadonlyArray<Simple>;
  opt?: ReadonlyArray<Simple>;
}

expectAssignable<DeepOmitOptional<ReadOnlyList>>({
  req: [{req: ''}],
});

expectNotAssignable<DeepOmitOptional<ReadOnlyList>>({
  req: [{req: '', opt: ''}],
  opt: [{req: '', opt: ''}],
});

interface ComplexList {
  req: Complex[];
  opt?: Complex[];
  nest: {
    req: Complex[];
    opt?: Complex[];
  };
}

expectAssignable<DeepOmitOptional<ComplexList>>({
  req: [complex],
  nest: {
    req: [complex],
  },
});

expectNotAssignable<DeepOmitOptional<ComplexList>>({
  req: [complex],
  opt: [],
  nest: {
    req: [complex],
    opt: [complex],
  },
});
