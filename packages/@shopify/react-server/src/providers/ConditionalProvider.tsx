import React from 'react';

interface Props<ContextType> {
  condition: boolean;
  provider: React.Provider<ContextType>;
  props: React.ProviderProps<ContextType>;
  children: React.ReactElement<ContextType>;
}

export function ConditionalProvider<ContextType>({
  condition,
  provider: Provider,
  props,
  children,
}: Props<ContextType>) {
  if (condition) {
    return <Provider {...props}>{children}</Provider>;
  }

  return children || null;
}
