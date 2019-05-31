import * as React from 'react';
import {random} from 'faker';

import {Root} from '../root';
import {mount, createMount} from '../mount';
import {destroyAll} from '../destroy';

describe('mount()', () => {
  afterEach(() => {
    destroyAll();
  });

  it('constructs and returns a root element', () => {
    const root = mount(<div>Hello world</div>);
    expect(root).toBeInstanceOf(Root);
    expect(document.body.firstElementChild!.innerHTML).toBe(
      '<div>Hello world</div>',
    );
  });
});

describe('createMount()', () => {
  it('calls context() with the passed options', () => {
    const spy = jest.fn();
    const options = {foo: 'bar'};

    const customMount = createMount<typeof options>({
      context: spy,
      render: element => element,
    });

    customMount(<div />, options);

    expect(spy).toHaveBeenCalledWith(options);
  });

  it('stores the result of calling context() on Root#context', () => {
    const context = {foo: 'barbaz'};
    const customMount = createMount<{}, typeof context>({
      context: () => context,
      render: element => element,
    });

    const div = customMount(<div />);

    expect(div).toHaveProperty('context', context);
  });

  it('calls render with the element, context, and options', () => {
    const options = {foo: 'bar'};
    const context = {bar: 'baz'};
    const element = <div />;
    const spy = jest.fn((element: React.ReactElement<{}>) => element);

    const customMount = createMount<typeof options, typeof context>({
      context: () => context,
      render: spy,
    });

    customMount(<div />, options);

    expect(spy).toHaveBeenCalledWith(element, context, options);
  });

  it('resolves the returned Root instance to the top level node in the original tree', () => {
    const customMount = createMount({
      render: element => <span id="ShouldNotBeFound">{element}</span>,
    });

    const div = customMount(<div />);

    expect(div).toHaveProperty('type', 'div');
    expect(div).not.toContainReactComponent('span', {id: 'ShouldNotBeFound'});
  });

  it('can set props on a nested element even if it is wrapped in providers', () => {
    function TestComponent({words}: {words: string}) {
      return <div>{words}</div>;
    }

    function Wrapper({children}: {children: React.ReactElement<any>}) {
      return children;
    }

    const customMount = createMount({
      render: element => <Wrapper>{element}</Wrapper>,
    });

    const originalWords = random.words();
    const updatedWords = random.words();
    const testComponent = customMount(<TestComponent words={originalWords} />);

    testComponent.setProps({words: updatedWords});

    expect(testComponent).not.toContainReactText(originalWords);
    expect(testComponent).toContainReactText(updatedWords);
  });

  it('calls afterMount with the wrapper and options', () => {
    const spy = jest.fn();
    const options = {foo: 'bar'};

    const customMount = createMount<typeof options>({
      render: element => element,
      afterMount: spy,
    });

    const div = customMount(<div />, options);

    expect(spy).toHaveBeenCalledWith(div, options);
  });

  it('returns a promise for the wrapper if afterMount returns a promise', async () => {
    const customMount = createMount<{}, {}, true>({
      render: element => element,
      afterMount: () => Promise.resolve(),
    });

    const div = customMount(<div />);

    expect(div).toBeInstanceOf(Promise);
    await expect(div).resolves.toBeInstanceOf(Root);
  });
});
