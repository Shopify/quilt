interface Range {
  start: number;
  end: number;
}

export interface GraphQLOperationDetails {
  name: string;
  duration: number;
  start: number;
  end: number;
  success: boolean;
  errors?: {message: string; path?: string}[];
  url?: string;
  status?: number;
  requestId?: string;
}

export function totalGraphQLTime(operations: GraphQLOperationDetails[]) {
  const ranges = new Set<Range>();

  for (const {start, end} of operations) {
    const newRange = {start, end};

    const overlappingRanges = [...ranges].filter(
      range =>
        timeIsInRange(start, range) ||
        timeIsInRange(end, range) ||
        timeIsInRange(range.start, newRange),
    );

    for (const range of overlappingRanges) {
      ranges.delete(range);
    }

    ranges.add(squashRanges([newRange, ...overlappingRanges]));
  }

  return [...ranges].reduce((total, {start, end}) => total + end - start, 0);
}

function squashRanges(ranges: Range[]) {
  const [first, ...rest] = ranges;
  return rest.reduce<Range>((fullRange, range) => {
    return {
      start: timeIsBefore(range.start, fullRange.start)
        ? range.start
        : fullRange.start,
      end: timeIsAfter(range.end, fullRange.end) ? range.end : fullRange.end,
    };
  }, first);
}

function timeIsBefore(timeOne: number, timeTwo: number) {
  return timeOne <= timeTwo;
}

function timeIsAfter(timeOne: number, timeTwo: number) {
  return timeOne >= timeTwo;
}

function timeIsInRange(time: number, {start, end}: Range) {
  return timeIsAfter(time, start) && timeIsBefore(time, end);
}
