import React from 'react';
import {renderToString} from 'react-dom/server';
import {HydrationContext, HydrationManager} from '@shopify/react-hydrate';

import {HtmlManager} from '../../manager';
import {HtmlContext} from '../../context';
import {MANAGED_ATTRIBUTE, removeDuplicate} from '../../utilities';

import {Script} from './Script';
import Serialize from './Serialize';
import {Stylesheet} from './Stylesheet';
import {InlineStyle} from './InlineStyle';

export interface Asset {
  path: string;
  integrity?: string;
}

export interface ScriptAsset extends Asset {
  type?: 'module' | 'nomodule' | 'script';
}

export interface InlineStyle {
  content: string;
}

export interface HtmlProps {
  manager?: HtmlManager;
  hydrationManager?: HydrationManager;
  children?: React.ReactElement<any> | string;
  locale?: string;
  styles?: Asset[];
  inlineStyles?: InlineStyle[];
  scripts?: ScriptAsset[];
  blockingScripts?: ScriptAsset[];
  preloadAssets?: Asset[];
  headMarkup?: React.ReactNode;
  bodyMarkup?: React.ReactNode;
}

export default function Html({
  manager,
  hydrationManager,
  children = '',
  locale = 'en',
  blockingScripts = [],
  scripts = [],
  styles = [],
  inlineStyles = [],
  preloadAssets = [],
  headMarkup = null,
  bodyMarkup = null,
}: HtmlProps) {
  const markup =
    typeof children === 'string'
      ? children
      : render(children, {htmlManager: manager, hydrationManager});

  const extracted = manager && manager.extract();

  const serializationMarkup = extracted
    ? extracted.serializations.map(({id, data}) => (
        <Serialize key={id} id={id} data={data} />
      ))
    : null;

  const managedProps = {[MANAGED_ATTRIBUTE]: true};

  const titleMarkup =
    extracted && extracted.title ? (
      <title {...managedProps}>{extracted.title}</title>
    ) : null;

  const metaMarkup = extracted
    ? removeDuplicate(extracted.metas).map((metaProps, index) => (
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

  const stylesheetMarkup = styles.map(style => {
    return (
      <Stylesheet
        key={style.path}
        href={style.path}
        integrity={style.integrity}
        crossOrigin="anonymous"
      />
    );
  });

  const inlineStylesMarkup = inlineStyles.map(inlineStyle => {
    return (
      <InlineStyle key={inlineStyle.content}>{inlineStyle.content}</InlineStyle>
    );
  });

  const blockingScriptsMarkup = blockingScripts.map(script => {
    return (
      <Script
        key={script.path}
        src={script.path}
        integrity={script.integrity}
        type={script.type}
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
        type={script.type}
        crossOrigin="anonymous"
        defer
      />
    );
  });

  const preloadAssetsMarkup = preloadAssets.map(asset => (
    <link key={asset.path} rel="prefetch" href={asset.path} />
  ));

  const htmlAttributes = extracted ? extracted.htmlAttributes : {};
  const bodyAttributes = extracted ? extracted.bodyAttributes : {};

  // eslint-disable-next-line no-process-env
  if (process.env.NODE_ENV === 'development') {
    if (bodyAttributes.style == null) {
      bodyAttributes.style = {visibility: 'hidden'};
    } else {
      bodyAttributes.style.visibility = 'hidden';
    }
  }

  return (
    <html lang={locale} {...htmlAttributes}>
      <head>
        {titleMarkup}
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="referrer" content="never" />
        {metaMarkup}
        {linkMarkup}

        {stylesheetMarkup}
        {inlineStylesMarkup}
        {headMarkup}
        {blockingScriptsMarkup}
        {deferredScriptsMarkup}
        {preloadAssetsMarkup}
      </head>

      <body {...bodyAttributes}>
        <div id="app" dangerouslySetInnerHTML={{__html: markup}} />

        {bodyMarkup}
        {serializationMarkup}
      </body>
    </html>
  );
}

function render(
  app: React.ReactElement<any>,
  {
    htmlManager,
    hydrationManager,
  }: {htmlManager?: HtmlManager; hydrationManager?: HydrationManager},
) {
  const hydrationWrapped = hydrationManager ? (
    <HydrationContext.Provider value={hydrationManager}>
      {app}
    </HydrationContext.Provider>
  ) : (
    app
  );

  const content =
    htmlManager == null ? (
      app
    ) : (
      <HtmlContext.Provider value={htmlManager}>
        {hydrationWrapped}
      </HtmlContext.Provider>
    );

  return renderToString(content);
}
