import {clock} from '@shopify/jest-dom-mocks';
import {StatusCode} from '@shopify/network';

import {GraphQLOperationDetails} from '../../types';
import {totalGraphQLTime} from '../total-graphql-time';

describe('totalGraphQLTime()', () => {
  beforeEach(() => {
    // Need a fake date to prevent flakiness of using Date.now()
    // What this date represents is left as a journey to the reader.
    clock.mock(new Date(2004, 8, 24, 0, 0, 0, 0));
  });

  afterEach(() => {
    clock.restore();
  });

  it('counts a single operation', () => {
    const duration = 123;

    expect(totalGraphQLTime([createGraphQLOperationWithTiming(duration)])).toBe(
      duration,
    );
  });

  it('counts multiple non-overlapping operations', () => {
    const durationOne = 150;
    const durationTwo = 300;

    expect(
      totalGraphQLTime([
        createGraphQLOperationWithTiming(durationOne, 1000),
        createGraphQLOperationWithTiming(durationTwo, 1000 - 100 - durationOne),
      ]),
    ).toBe(durationOne + durationTwo);
  });

  it('counts multiple operations where one starts before the end of the previous one', () => {
    const durationOne = 150;
    const durationTwo = 300;
    const overlap = 50;

    expect(
      totalGraphQLTime([
        createGraphQLOperationWithTiming(durationOne, 1000),
        createGraphQLOperationWithTiming(
          durationTwo,
          1000 - durationOne + overlap,
        ),
      ]),
    ).toBe(durationOne + durationTwo - overlap);
  });

  it('counts multiple operations where one entirely overlaps the other', () => {
    const durationOne = 600;
    const durationTwo = 300;

    expect(
      totalGraphQLTime([
        createGraphQLOperationWithTiming(durationOne, 1000),
        createGraphQLOperationWithTiming(durationTwo, 1000 - 100),
      ]),
    ).toBe(durationOne);
  });
});

function createGraphQLOperationWithTiming(
  duration: number,
  startOffset = duration,
): GraphQLOperationDetails {
  const now = Date.now();

  return {
    name: 'Operation',
    success: true,
    status: StatusCode.Ok,
    duration,
    start: now - startOffset,
    end: now - startOffset + duration,
  };
}
