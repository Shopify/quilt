import React from 'react';

interface Props<T extends React.ComponentType<any>> {
  condition: boolean;
  provider: T;
  // props: React.ComponentPropsWithoutRef<T>;
  props?: any;
  children: any;
}

export function ConditionalProvider<T extends React.ComponentType<any>>({
  condition,
  provider: Provider,
  props,
  children,
}: Props<T>) {
  if (condition) {
    return <Provider {...props}>{children}</Provider>;
  }

  return children;
}
