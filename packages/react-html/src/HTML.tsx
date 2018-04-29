import * as React from 'react';
import {HelmetData} from 'react-helmet';
import {Serializer} from '@shopify/react-serialize';
import {Script, Style} from './components';

export interface TranslationDictionary {
  [key: string]: string | TranslationDictionary;
}

export interface ErrorInfo {
  message: string;
  stack: string | undefined;
}

export type ErrorLike = Error | ErrorInfo;

export interface Asset {
  path: string;
  integrity?: string;
}

export interface Browser {
  userAgent: string;
  supported: boolean;
}

export interface Props {
  markup: string;
  helmet?: HelmetData;
  initialApolloData?: {[key: string]: any};
  initialReduxState?: {[key: string]: any};
  requestDetails?: {[key: string]: any};
  browser?: Browser;
  styles?: Asset[];
  translations?: TranslationDictionary;
  synchronousScripts?: Asset[];
  deferedScripts?: Asset[];
  error?: ErrorLike;
}

export default function HTML({
  markup,
  helmet,
  browser,
  initialApolloData,
  initialReduxState,
  requestDetails,
  translations,
  deferedScripts = [],
  synchronousScripts = [],
  styles = [],
  error,
}: Props) {
  const htmlAttributes = helmet.htmlAttributes.toComponent();
  const bodyAttributes = helmet.bodyAttributes.toComponent();

  const stylesMarkup = styles.map(style => {
    return (
      <Style
        key={style.path}
        href={style.path}
        integrity={style.integrity}
        crossOrigin="anonymous"
      />
    );
  });

  const synchronousScriptsMarkup = synchronousScripts.map(script => {
    return (
      <Script
        key={script.path}
        src={script.path}
        integrity={script.integrity}
        crossOrigin="anonymous"
      />
    );
  });

  const deferedScriptsMarkup = deferedScripts.map(script => {
    return (
      <Script
        key={script.path}
        src={script.path}
        integrity={script.integrity}
        crossOrigin="anonymous"
        defer
      />
    );
  });

  /* eslint-disable no-process-env, no-undefined */
  const bodyStyles =
    process.env.NODE_ENV === 'development' && deferedScripts.length > 0
      ? {display: 'none'}
      : undefined;
  /* eslint-enable no-process-env, no-undefined */

  // we need to hard-code these in the SSR response head for bugsnag
  const requestDetailsSerializer = requestDetails ? (
    <Serializer id="request-details" data={requestDetails} />
  ) : null;

  const translationsSerializer = translations ? (
    <Serializer id="translations" data={translations} />
  ) : null;

  const browserSerializer = browser ? (
    <Serializer id="browser" data={browser} />
  ) : null;

  const initialApolloDataSerializer = initialApolloData ? (
    <Serializer id="initial-apollo-data" data={initialApolloData} />
  ) : null;

  const initialReduxStateSerializer = initialReduxState ? (
    <Serializer id="initial-redux-state" data={initialReduxState} />
  ) : null;

  const errorSerializer = error ? <Serializer id="error" data={error} /> : null;

  return (
    <html lang="en" {...htmlAttributes}>
      <head>
        {helmet.title.toComponent()}
        {helmet.meta.toComponent()}
        {helmet.link.toComponent()}
        {stylesMarkup}

        {requestDetailsSerializer}
        {synchronousScriptsMarkup}
      </head>

      <body {...bodyAttributes} style={bodyStyles}>
        <div
          id="app"
          style={{height: '100%'}}
          dangerouslySetInnerHTML={{__html: markup}}
        />

        {browserSerializer}
        {initialApolloDataSerializer}
        {initialReduxStateSerializer}
        {translationsSerializer}
        {errorSerializer}

        {deferedScriptsMarkup}
      </body>
    </html>
  );
}
