import {IsType} from './matchers';

export interface MatchHandler<T, R> {
  (val: T): R;
}

export interface When<T, R> {
  matcher: IsType<T>;
  onMatch: MatchHandler<T, R>;
}

function otherMatcher(_value: any): _value is never {
  return true;
}

export function other<R>(onMatch: MatchHandler<never, R>) {
  return when(otherMatcher)(onMatch);
}

export function when<T>(matcher: IsType<T>) {
  return function<R>(onMatch: MatchHandler<T, R>) {
    return {matcher, onMatch};
  };
}

export function doMatch<I>(value: I) {
  return function doMatch<R>(...cases: When<any, R>[]): R {
    const when = cases.find(({matcher}) => matcher(value));

    if (when == null) {
      throw Error("No match found, did you forget to add an 'other()' case?");
    }

    return when.onMatch(value);
  };
}

export default function match<R>(value: any) {
  return new Match<typeof value, R>(value);
}

export class Match<I, R> {
  private _value: I;
  private _whens: When<any, R>[] = [];

  constructor(value?: I) {
    if (value) {
      this._value = value;
    }
  }

  value(value: I) {
    this._value = value;
    return this;
  }

  when<T>(matcher: IsType<T>, matchHandler: MatchHandler<T, R>) {
    this._whens.push(when(matcher)(matchHandler));
    return this;
  }

  other(matchHandler: MatchHandler<never, R>) {
    this._whens.push(other(matchHandler));
    return this;
  }

  execute() {
    return doMatch(this._value)(...this._whens);
  }
}

// // you can't use "enum" as a type, so use this.
// export type EnumType = {[s: number]: string};

// function mapEnum(enumerable: EnumType, fn: Function): any[] {
//   // get all the members of the enum
//   const enumMembers: any[] = Object.keys(enumerable).map(
//     key => enumerable[key],
//   );

//   // we are only interested in the numeric identifiers as these represent the values
//   const enumValues: number[] = enumMembers.filter(v => typeof v === 'number');

//   // now map through the enum values
//   return enumValues.map(value => fn(value));
// }

// export class EnumMatch<E, R> {
//   value: E;
//   whens: When<any, R>[];
//   fullEnum: Object;
//   usedKeys: number;

//   constructor(value: E, fullEnum: EnumType) {
//     this.value = value;
//     this.fullEnum = fullEnum;
//   }

//   when(expected: E, matchHandler: MatchHandler<E, R>) {
//     this.usedKeys.push(E);
//     this.whens.push(when(isKey(expected))(matchHandler));
//   }

//   eval() {
//     const {whens, value} = this;
//     return match(value)(...whens);
//   }
// }
