import React from 'react';
import {mount} from '@shopify/react-testing';

import compose from '..';

describe('react-compose-enhancers', () => {
  describe('when invoked on a classical component', () => {
    it('returns an enhancer that takes a component and returns a component wrapping the original', () => {
      const Component = compose<Props>(
        fooEnhancer,
        barEnhancer,
      )(ClassicalComponent);

      const result = mount(<Component baz="baz" />);

      expect(result).toContainReactComponent(ClassicalComponent);
    });

    it('passes props on the wrapper down to the wrapped component', () => {
      const Component = compose<Props>(
        fooEnhancer,
        barEnhancer,
      )(ClassicalComponent);

      const expectedBaz = 'test';
      const result = mount(<Component baz={expectedBaz} />);

      expect(result).toContainReactComponent(ClassicalComponent, {
        baz: expectedBaz,
      });
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

      expect(result).toContainReactComponent(ClassicalComponent, expectedProps);
    });

    it('hoists static members to wrapper class', () => {
      const Component = compose<Props>(
        fooEnhancer,
        barEnhancer,
      )(ClassicalComponent);

      expect(Component.someStatic).toStrictEqual(ClassicalComponent.someStatic);
    });
  });

  describe('when invoked on a functional component', () => {
    it('returns an enhancer that takes a component and returns a component wrapping the original', () => {
      const Component = compose<Props>(
        fooEnhancer,
        barEnhancer,
      )(StatelessComponent);

      const result = mount(<Component baz="baz" />);

      expect(result).toContainReactComponent(StatelessComponent);
    });

    it('passes props on the wrapper down to the wrapped component', () => {
      const Component = compose<Props>(
        fooEnhancer,
        barEnhancer,
      )(StatelessComponent);

      const expectedBaz = 'test';
      const result = mount(<Component baz={expectedBaz} />);

      expect(result).toContainReactComponent(StatelessComponent, {
        baz: expectedBaz,
      });
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

      expect(result).toContainReactComponent(StatelessComponent, expectedProps);
    });
  });
});

interface FooProps {
  // eslint-disable-next-line react/no-unused-prop-types
  foo: string;
}

interface BarProps {
  // eslint-disable-next-line react/no-unused-prop-types
  bar: string;
}

interface Props {
  // eslint-disable-next-line react/no-unused-prop-types
  baz: string;
}

type ComposedProps = FooProps & BarProps & Props;

class ClassicalComponent extends React.Component<ComposedProps, never> {
  // eslint-disable-next-line @shopify/react-prefer-private-members
  static someStatic = 'some static';

  render() {
    return <div>classical component</div>;
  }
}

function StatelessComponent({foo, bar, baz}: ComposedProps) {
  return (
    <>
      stateless component {foo} {bar} {baz}
    </>
  );
}

function fooEnhancer(Component) {
  return function Wrapper(props: object) {
    return <Component foo="foo" {...props} />;
  };
}

function barEnhancer(Component) {
  return function Wrapper(props: object) {
    return <Component bar="bar" {...props} />;
  };
}
