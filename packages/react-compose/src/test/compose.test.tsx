import * as React from 'react';
import {mount} from 'enzyme';

import compose from '..';

describe('react-compose-enhancers', () => {
  describe('when invoked on a classical component', () => {
    it('returns an enhancer that takes a component and returns a component wrapping the original', () => {
      const Component = compose<Props>(
        fooEnhancer,
        barEnhancer,
      )(ClassicalComponent);

      const result = mount(<Component baz="baz" />);
      const wrappedComponent = result.find(ClassicalComponent);

      expect(wrappedComponent.exists()).toBe(true);
    });

    it('passes props on the wrapper down to the wrapped component', () => {
      const Component = compose<Props>(
        fooEnhancer,
        barEnhancer,
      )(ClassicalComponent);

      const expectedBaz = 'test';
      const result = mount(<Component baz={expectedBaz} />);
      const actualBaz = result.find(ClassicalComponent).prop('baz');

      expect(actualBaz).toBe(expectedBaz);
    });

    it('injects props from all enhancers passed to it to the resulting component', () => {
      const Component = compose<Props>(
        fooEnhancer,
        barEnhancer,
      )(ClassicalComponent);

      const expectedProps = {
        foo: 'foo',
        bar: 'bar',
        baz: 'baz',
      };
      const result = mount(<Component baz={expectedProps.baz} />);
      const actualProps = result.find(ClassicalComponent).props();

      expect(actualProps).toEqual(expectedProps);
    });

    it('hoists static members to wrapper class', () => {
      const Component = compose<Props>(
        fooEnhancer,
        barEnhancer,
      )(ClassicalComponent);

      expect(Component.someStatic).toEqual(ClassicalComponent.someStatic);
    });
  });

  describe('when invoked on a functional component', () => {
    it('returns an enhancer that takes a component and returns a component wrapping the original', () => {
      const Component = compose<Props>(
        fooEnhancer,
        barEnhancer,
      )(StatelessComponent);

      const result = mount(<Component baz="baz" />);
      const wrappedComponent = result.find(StatelessComponent);

      expect(wrappedComponent.exists()).toBe(true);
    });

    it('passes props on the wrapper down to the wrapped component', () => {
      const Component = compose<Props>(
        fooEnhancer,
        barEnhancer,
      )(StatelessComponent);

      const expectedBaz = 'test';
      const result = mount(<Component baz={expectedBaz} />);
      const actualBaz = result.find(StatelessComponent).prop('baz');

      expect(actualBaz).toBe(expectedBaz);
    });

    it('injects props from all enhancers passed to it to the resulting component', () => {
      const Component = compose<Props>(
        fooEnhancer,
        barEnhancer,
      )(StatelessComponent);

      const expectedProps = {
        foo: 'foo',
        bar: 'bar',
        baz: 'baz',
      };
      const result = mount(<Component baz={expectedProps.baz} />);
      const actualProps = result.find(StatelessComponent).props();

      expect(actualProps).toEqual(expectedProps);
    });
  });
});

interface FooProps {
  foo: string;
}

interface BarProps {
  bar: string;
}

interface Props {
  baz: string;
}

type ComposedProps = FooProps & BarProps & Props;

// eslint-disable-next-line
class ClassicalComponent extends React.Component<ComposedProps, never> {
  static someStatic = 'some static';

  render() {
    return <div>classical component</div>;
  }
}

function StatelessComponent({foo, bar, baz}: ComposedProps) {
  return (
    <div>
      stateless component {foo} {bar} {baz}
    </div>
  );
}

function fooEnhancer(Component) {
  return function Wrapper(props: Object) {
    return <Component foo="foo" {...props} />;
  };
}

function barEnhancer(Component) {
  return function Wrapper(props: Object) {
    return <Component bar="bar" {...props} />;
  };
}
