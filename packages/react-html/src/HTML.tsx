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
  synchronousScripts?: Asset[];
  deferedScripts?: Asset[];
  headData?: {[id: string]: any};
  data?: {[id: string]: any};
}

export default function HTML({
  children = '',
  deferedScripts = [],
  synchronousScripts = [],
  styles = [],
  data = {},
  headData = {},
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
        {helmet.link.toComponent()}
        {stylesMarkup}
        {headDataMarkup}

        {synchronousScriptsMarkup}
      </head>

      <body {...bodyAttributes} style={bodyStyles}>
        <div
          id="app"
          style={{height: '100%'}}
          dangerouslySetInnerHTML={{__html: markup}}
        />

        {dataMarkup}

        {deferedScriptsMarkup}
      </body>
    </html>
  );
}
