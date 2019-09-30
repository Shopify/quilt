// Should return () => Promise<string>
// done already
export function hello(input: string) {
  return `hello, ${input}`;
}

// From UI side: (input: () => string | Promise<string>) => Promise<() => Promise<string>>
// Shouldn't return input: () => string
// It should return () => string | Promise<string>
export function helloFunctionWithFunctionParam(input: () => string) {
  return () => `hello, ${input}`;
}

// calling this should return a function that returns a Promise of this result
export function helloFunction(input: string) {
  return () => `hello, ${input}`;
}

// - 1) Support input & output: Array of objects, nested objects, functions
// - 2) Make sure the return types are promisified input/returns if they are functions as well
// - return array of functions => array of functions that return promises for types

// RULE 1: any function that returned, it's return types has to be promisified
// RULE: any function that's an input argument, it's input types must be T | Promise<T>
