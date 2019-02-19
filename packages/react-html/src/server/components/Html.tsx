import * as React from 'react';
import {renderToString} from 'react-dom/server';

import {Script, Style, Meta, Favicon, Title} from '../../components';
import Manager from '../../manager';
import {MANAGED_ATTRIBUTE} from '../../utilities';

import Serialize from './Serialize';

export interface Asset {
  path: string;
  integrity?: string;
}

export interface Props {
  manager?: Manager;
  children: React.ReactElement<any> | string;
  locale?: string;
  styles?: Asset[];
  scripts?: Asset[];
  blockingScripts?: Asset[];
  headMarkup?: React.ReactNode;
  bodyMarkup?: React.ReactNode;
  favicon?: string;
  title?: string;
}

export default function Html({
  manager,
  children,
  locale = 'en',
  blockingScripts = [],
  scripts = [],
  styles = [],
  headMarkup = null,
  bodyMarkup = null,
  favicon,
  title,
}: Props) {
  const markup =
    typeof children === 'string' ? children : renderToString(children);

  const extracted = manager && manager.extract();

  const serializationMarkup = extracted
    ? extracted.serializations.map(({id, data}) => (
        <Serialize key={id} id={id} data={data} />
      ))
    : null;

  const managedProps = {[MANAGED_ATTRIBUTE]: true};

  const titleFallbackMarkup = title ? <Title>{title}</Title> : null;

  const titleMarkup =
    extracted && extracted.title ? (
      <title {...managedProps}>{extracted.title}</title>
    ) : (
      titleFallbackMarkup
    );

  const metaMarkup = extracted
    ? extracted.metas.map((metaProps, index) => (
        // This is never re-rendered, since it is the initial HTML document,
        // so index keys are acceptable.
        // eslint-disable-next-line react/no-array-index-key
        <meta key={index} {...managedProps} {...metaProps} />
      ))
    : null;

  const linkMarkup = extracted
    ? extracted.links.map((linkProps, index) => (
        // This is never re-rendered, since it is the initial HTML document,
        // so index keys are acceptable.
        // eslint-disable-next-line react/no-array-index-key
        <link key={index} {...managedProps} {...linkProps} />
      ))
    : null;

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

  const bodyStyles: {visibility: 'hidden'} | undefined =
    // eslint-disable-next-line no-process-env
    process.env.NODE_ENV === 'development' ? {visibility: 'hidden'} : undefined;

  const faviconMarkup = favicon ? <Favicon source={favicon} /> : null;

  return (
    <html lang={locale}>
      <head>
        <Meta charSet="utf-8" />
        <Meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <Meta name="referrer" content="never" />
        {faviconMarkup}
        {titleMarkup}
        {metaMarkup}
        {linkMarkup}

        {stylesMarkup}
        {headMarkup}
        {blockingScriptsMarkup}
      </head>

      <body style={bodyStyles}>
        <div id="app" dangerouslySetInnerHTML={{__html: markup}} />

        {bodyMarkup}
        {serializationMarkup}
        {deferredScriptsMarkup}
      </body>
    </html>
  );
}
