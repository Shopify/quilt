import * as React from 'react';
import Helmet from 'react-helmet';
import {renderToString} from 'react-dom/server';

import {Script, Style} from '../../components';
import Manager from '../../manager';

import Serialize from './Serialize';

export interface Asset {
  path: string;
  integrity?: string;
}

export interface Props {
  manager?: Manager;
  children: React.ReactNode;
  locale?: string;
  styles?: Asset[];
  scripts?: Asset[];
  blockingScripts?: Asset[];
  headMarkup?: React.ReactNode;
  bodyMarkup?: React.ReactNode;
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
}: Props) {
  const markup = renderToString(children);
  const helmet = Helmet.renderStatic();

  const htmlAttributes = helmet.htmlAttributes.toComponent();
  const bodyAttributes = helmet.bodyAttributes.toComponent();

  const serializationMarkup = manager
    ? manager
        .extract()
        .map(({id, data}) => <Serialize key={id} id={id} data={data} />)
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

  const bodyStyles =
    // eslint-disable-next-line no-process-env
    process.env.NODE_ENV === 'development' ? {display: 'none'} : undefined;

  return (
    <html lang={locale} {...htmlAttributes}>
      <head>
        {helmet.title.toComponent()}
        {helmet.meta.toComponent()}
        {helmet.script.toComponent()}
        {helmet.link.toComponent()}

        {stylesMarkup}
        {headMarkup}
        {blockingScriptsMarkup}
      </head>

      <body {...bodyAttributes} style={bodyStyles}>
        <div id="app" dangerouslySetInnerHTML={{__html: markup}} />

        {bodyMarkup}
        {serializationMarkup}
        {deferredScriptsMarkup}
      </body>
    </html>
  );
}
