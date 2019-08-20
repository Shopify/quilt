import React from 'react';
import {Provider as AppBridgeProvider} from '@shopify/app-bridge-react';
import {useSerialized} from '@shopify/react-html';

type AppBridgeConfig = {
  apiKey: string;
  shop: string;
  forceRedirect?: boolean;
};

interface Props {
  config: Partial<AppBridgeConfig>;
  children: React.ReactNode;
}

export function AppBridge({config: explicitConfig, children}: Props) {
  const [serializedConfig, Serialize] = useSerialized<Partial<AppBridgeConfig>>(
    'app-bridge',
  );

  const appBridgeConfig: Partial<AppBridgeConfig> = {
    ...explicitConfig,
    ...(serializedConfig ? serializedConfig : {}),
  };

  if (!appBridgeConfig.apiKey || !appBridgeConfig.shop) {
    // eslint-disable-next-line no-console
    console.error(
      `App Bridge cannot be started because apiKey or shop value is missing.`,
    );
  }

  const AppBridgeProviderMarkup =
    appBridgeConfig.apiKey && appBridgeConfig.shop ? (
      <AppBridgeProvider
        config={{
          apiKey: appBridgeConfig.apiKey,
          shopOrigin: appBridgeConfig.shop,
          forceRedirect: appBridgeConfig.forceRedirect,
        }}
      >
        {children}
      </AppBridgeProvider>
    ) : (
      children
    );

  return (
    <>
      {AppBridgeProviderMarkup}
      <Serialize data={() => appBridgeConfig} />
    </>
  );
}
