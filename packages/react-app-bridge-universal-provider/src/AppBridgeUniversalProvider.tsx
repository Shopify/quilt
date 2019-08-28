import React from 'react';
import {Provider as AppBridgeProvider} from '@shopify/app-bridge-react';
import {useSerialized} from '@shopify/react-html';

type AppBridgeConfig = React.ComponentProps<typeof AppBridgeProvider>['config'];

interface Props extends Partial<AppBridgeConfig> {
  children?: React.ReactNode;
}

export function AppBridgeUniversalProvider({
  children,
  ...explicitConfig
}: Props) {
  const [serializedConfig, Serialize] = useSerialized<Partial<AppBridgeConfig>>(
    'app-bridge',
  );

  const appBridgeConfig: Partial<AppBridgeConfig> = {
    ...explicitConfig,
    ...(serializedConfig ? serializedConfig : {}),
  };

  if (!appBridgeConfig.apiKey || !appBridgeConfig.shopOrigin) {
    throw new Error(
      'App Bridge cannot be started because apiKey or shopOrigin value is missing.',
    );
  }

  return (
    <>
      <AppBridgeProvider
        config={{
          apiKey: appBridgeConfig.apiKey,
          shopOrigin: appBridgeConfig.shopOrigin,
          forceRedirect: appBridgeConfig.forceRedirect,
        }}
      >
        {children}
      </AppBridgeProvider>
      <Serialize data={() => appBridgeConfig} />
    </>
  );
}
