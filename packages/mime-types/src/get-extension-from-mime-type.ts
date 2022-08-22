import {MimeType} from './types';

export function getExtensionFromMimeType(mimeType: MimeType) {
  switch (mimeType) {
    case MimeType.Csv:
      return '.csv';
    case MimeType.Gif:
      return '.gif';
    case MimeType.Glb:
      return '.glb';
    case MimeType.Html:
      return '.html';
    case MimeType.Jpeg:
      return '.jpg';
    case MimeType.Js:
      return '.js';
    case MimeType.Json:
      return '.json';
    case MimeType.Hls:
      return '.m3u8';
    case MimeType.Mov:
      return '.mov';
    case MimeType.Mp4:
      return '.mp4';
    case MimeType.Webm:
      return '.webm';
    case MimeType.Pdf:
      return '.pdf';
    case MimeType.Png:
      return '.png';
    case MimeType.Text:
      return '.txt';
    case MimeType.Usdz:
      return '.usdz';
    case MimeType.Zip:
      return '.zip';
    case MimeType.Webp:
      return '.webp';
    case MimeType.Heic:
      return '.heic';
  }

  const nope: never = mimeType;
  return nope;
}
