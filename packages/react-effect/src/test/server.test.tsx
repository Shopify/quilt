import * as React from 'react';

import {extract} from '../server';
import {METHOD_NAME, Extractable} from '../extractable';

describe('extract()', () => {
  it('calls the extraction method with true by default', async () => {
    const spy = jest.fn();
    const Component = createComponent(spy);
    await extract(<Component />);
    expect(spy).toHaveBeenCalledWith(true);
  });

  it('calls the extraction method with an array of symbols', async () => {
    const spy = jest.fn();
    const include = [];
    const Component = createComponent(spy);
    await extract(<Component />, include);
    expect(spy).toHaveBeenCalledWith(include);
  });

  it('waits on promises higher in the tree before calling the lower values', async () => {
    const globalContext = {value: 0};
    const spy = jest.fn();
    const Component = createComponent(() => {
      return Promise.resolve().then(() => {
        spy(globalContext.value);
        globalContext.value += 1;
      });
    });

    await extract(
      <Component>
        <Component />
      </Component>,
    );

    expect(spy).toHaveBeenLastCalledWith(1);
    expect(globalContext).toHaveProperty('value', 2);
  });
});

function createComponent(extract: Extractable[typeof METHOD_NAME]) {
  return class ExtractableComponent
    extends React.Component<{children?: React.ReactNode}>
    implements Extractable {
    [METHOD_NAME](include) {
      extract(include);
    }

    render() {
      return this.props.children || <div />;
    }
  };
}
