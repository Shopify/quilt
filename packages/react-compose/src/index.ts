import React, {ComponentType} from 'react';
import hoistStatics from 'hoist-non-react-statics';

export type ReactComponent<P> = ComponentType<P>;
export type ComponentClass = React.ComponentClass<any>;

export type WrappingFunction = (
  Component: ReactComponent<any>,
) => ReactComponent<any>;

export default function compose<Props>(
  ...wrappingFunctions: WrappingFunction[]
) {
  return function wrapComponent<ComposedProps, C>(
    OriginalComponent: ReactComponent<ComposedProps> & C,
  ): ReactComponent<Props> & C {
    let result: ReactComponent<ComposedProps>;

    if (wrappingFunctions.length === 0) {
      result = OriginalComponent;
    } else {
      result = wrappingFunctions.reduce(
        (wrappingFunctionA, wrappingFunctionB) => {
          return (WrappingComponent: ReactComponent<any>) =>
            wrappingFunctionA(wrappingFunctionB(WrappingComponent));
        },
      )(OriginalComponent);
    }

    return hoistStatics(
      result as ComponentClass,
      OriginalComponent as ComponentClass,
    ) as ReactComponent<Props> & C;
  };
}
