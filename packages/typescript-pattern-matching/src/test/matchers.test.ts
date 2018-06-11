import {S_IFIFO} from 'constants';

describe('matchers', () => {
  describe('isTruth', () => {});
  describe('isString', () => {});
  describe('isNull', () => {});
  describe('isValue', () => {});
  describe('isTuple', () => {});
  describe('isArrayOf', () => {});
  describe('isShape', () => {});
});

const thing = iff(thing, isTruthy)({
  then: () => foo,
  else: () => bar,
});

function Feed({url}) {
  return (
    <Fetch url={url} as={json}>
      {() => {}}
    </Fetch>
  );
}
