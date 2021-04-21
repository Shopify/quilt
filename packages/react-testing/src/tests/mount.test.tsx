import React from 'react';
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

    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        props: {
          children: element,
        },
      }),
      context,
      options,
    );
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
    expect(await div).toBeInstanceOf(Root);
  });

  describe('extend', () => {
    it('calls context with the merged options', () => {
      const spy = jest.fn(identity);
      const options = {foo: 'bar'};
      const additionalOptions = {baz: 'qux'};

      const customMount = createMount<typeof options, typeof options>({
        context: identity,
        render: identity,
      });

      const extendedMount = customMount.extend<
        typeof additionalOptions,
        typeof additionalOptions,
        false
      >({
        render: identity,
        context: spy,
      });

      extendedMount(<div />, {...options, ...additionalOptions});

      expect(spy).toHaveBeenCalledWith({...options, ...additionalOptions});
    });

    it('stores the merged context on Root#context', () => {
      const context = {foo: 'bar'};
      const additionalContext = {baz: 'qux'};

      const customMount = createMount<{}, typeof context>({
        context: () => context,
        render: identity,
      });

      const extendedMount = customMount.extend<
        {},
        typeof additionalContext,
        false
      >({
        context: () => additionalContext,
        render: identity,
      });

      const div = extendedMount(<div />);

      expect(div).toHaveProperty('context', {...context, ...additionalContext});
    });

    it('calls the augmented render before the original render with the element, merged context, and merged options', () => {
      const options = {foo: 'bar'};
      const additionalOptions = {bar: 'baz'};
      const finalOptions = {...options, ...additionalOptions};

      const context = {baz: 'qux'};
      const additionalContext = {qux: 'fuzz'};
      const finalContext = {...context, ...additionalContext};

      const element = <div />;

      function InsideRender({children}: {children: React.ReactElement}) {
        return <>{children}</>;
      }

      const renderSpy = jest.fn((element: React.ReactElement<{}>) => element);
      const additionalRenderSpy = jest.fn((element: React.ReactElement<{}>) => (
        <InsideRender>{element}</InsideRender>
      ));

      const customMount = createMount<typeof options, typeof context>({
        context: () => context,
        render: renderSpy,
      });

      const extendedMount = customMount.extend<
        typeof additionalOptions,
        typeof additionalContext
      >({
        context: () => additionalContext,
        render: additionalRenderSpy,
      });

      extendedMount(element, finalOptions);

      expect(additionalRenderSpy).toHaveBeenCalledWith(
        expect.objectContaining({props: {children: element}}),
        finalContext,
        finalOptions,
      );

      expect(renderSpy).toHaveBeenCalledWith(
        expect.objectContaining({type: InsideRender}),
        finalContext,
        finalOptions,
      );
    });

    it('calls afterMount with the wrapper and options', () => {
      const spy = jest.fn();
      const options = {foo: 'bar'};

      const customMount = createMount({
        render: identity,
      });

      const extendedMount = customMount.extend<typeof options>({
        render: identity,
        afterMount: spy,
      });

      const div = extendedMount(<div />, options);

      expect(spy).toHaveBeenCalledWith(div, options);
    });

    it('waits until the extended afterMount resolves before calling the original afterMount', async () => {
      const options = {foo: 'bar'};

      const afterMountSpy = jest.fn();
      const additionalAfterMountSpy = jest.fn(
        () => new Promise(resolve => setTimeout(resolve, 1)),
      );

      const customMount = createMount<typeof options>({
        render: identity,
        afterMount: afterMountSpy,
      });

      const extendedMount = customMount.extend<{}, {}, true>({
        render: identity,
        afterMount: additionalAfterMountSpy,
      });

      const mountPromise = extendedMount(<div />, options);

      expect(additionalAfterMountSpy).toHaveBeenCalled();
      expect(afterMountSpy).not.toHaveBeenCalled();

      const div = await mountPromise;

      expect(afterMountSpy).toHaveBeenCalledWith(div, options);
    });
  });
});

function identity<T>(value: T) {
  return value;
}
