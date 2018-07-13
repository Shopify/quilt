import * as React from 'react';
import Helmet from 'react-helmet';
import {renderToString} from 'react-dom/server';
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
  children?: React.ReactNode;
  styles?: Asset[];
  blockingScripts?: Asset[];
  scripts?: Asset[];
  headData?: {[id: string]: any};
  data?: {[id: string]: any};
  hideForInitialLoad?: boolean;
}

export default function HTML({
  children = '',
  blockingScripts = [],
  scripts = [],
  styles = [],
  data = {},
  headData = {},
  hideForInitialLoad,
}: Props) {
  const markup = renderToString(children);
  const helmet = Helmet.renderStatic();

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

  const blockingScriptsMarkup = blockingScripts.map(script => {
    return (
      <Script
        key={script.path}
        src={script.path}
        integrity={script.integrity}
        crossOrigin="anonymous"
      />
    );
  });

  const deferredScriptsMarkup = scripts.map(script => {
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

  /* eslint-disable no-undefined */
  const bodyStyles = hideForInitialLoad ? {display: 'none'} : undefined;
  /* eslint-enable no-undefined */

  const headDataMarkup = Object.keys(headData).map(id => {
    return <Serializer key={id} id={id} data={headData[id]} />;
  });

  const dataMarkup = Object.keys(data).map(id => {
    return <Serializer key={id} id={id} data={data[id]} />;
  });

  return (
    <html lang="en" {...htmlAttributes}>
      <head>
        {helmet.title.toComponent()}
        {helmet.meta.toComponent()}
        {helmet.script.toComponent()}
        {helmet.link.toComponent()}

        {stylesMarkup}
        {headDataMarkup}
        {blockingScriptsMarkup}
      </head>

      <body {...bodyAttributes} style={bodyStyles}>
        <div
          id="app"
          style={{height: '100%'}}
          dangerouslySetInnerHTML={{__html: markup}}
        />

        {dataMarkup}

        {deferredScriptsMarkup}
      </body>
    </html>
  );
}
