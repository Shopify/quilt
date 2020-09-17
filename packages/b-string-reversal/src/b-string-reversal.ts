export class StringReversal {
  inputString: string;

  constructor(input) {
    this.inputString = input;
  }

  reverseString() {
    const splitString = this.inputString.split();
    const reverseArray = splitString.reverse();
    return reverseArray.join();
  }
}

export function asPlainObject(browser?: StringReversal) {
  return {
    reversedString: reverseString(),
  };
}
