import * as React from 'react';
import Meta from './Meta';
import Link from './Link';

export enum IconSize {
  Large = 114,
  Medium = 72,
  Small = 57,
}

interface Icon {
  size: IconSize;
  url: string;
}

interface Props {
  icons?: Icon[];
  startUpImage?: string;
}

export default function AppleHomeScreen({icons = [], startUpImage}: Props) {
  const iconsMarkup = icons.map(({size, url}) => (
    <Link
      key={size}
      rel="apple-touch-icon"
      sizes={`${size}x${size}`}
      href={url}
    />
  ));
  const startUpImageMarkup = startUpImage ? (
    <Link rel="apple-touch-startup-image" href={startUpImage} />
  ) : null;
  return (
    <>
      <Meta name="apple-mobile-web-app-capable" content="yes" />
      <Meta name="apple-mobile-web-app-status-bar-style" content="black" />
      {iconsMarkup}
      {startUpImageMarkup}
    </>
  );
}
