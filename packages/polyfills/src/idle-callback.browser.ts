import {ExtendedWindow} from '@shopify/useful-types';

const FOO: ExtendedWindow<any> = 'bar';

function example() {
  console.log(FOO);
  return setImmediate(() => {});
}

example();
