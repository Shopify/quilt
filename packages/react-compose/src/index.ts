import type {ComponentType, ComponentClass as ReactComponentClass} from 'react';
import hoistStatics from 'hoist-non-react-statics';
import type {NonReactStatics} from '@shopify/useful-types';

export type ReactComponent<P> = ComponentType<P>;
export type ComponentClass = ReactComponentClass<any>;

export type WrappingFunction = (
  Component: ReactComponent<any>,
) => ReactComponent<any>;

export default function compose<Props>(
  ...wrappingFunctions: WrappingFunction[]
) {
  return function wrapComponent<ComposedProps, C>(
    OriginalComponent: ReactComponent<ComposedProps> & C,
  ): ReactComponent<Props> & NonReactStatics<typeof OriginalComponent> {
    const result: ReactComponent<ComposedProps> = wrappingFunctions.reduceRight(
      (component: ReactComponent<any>, wrappingFunction: WrappingFunction) =>
        wrappingFunction(component),
      OriginalComponent,
    );

    return hoistStatics(
      result as ComponentClass,
      OriginalComponent as ComponentClass,
    ) as ReactComponent<Props> & NonReactStatics<typeof OriginalComponent>;
  };
}
