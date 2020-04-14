import {MimeType} from './types';

export function getExtensionFromMimeType(mimeType: MimeType) {
  switch (mimeType) {
    case MimeType.Gif:
      return '.gif';
    case MimeType.Glb:
      return '.glb';
    case MimeType.Hls:
      return '.m3u8';
    case MimeType.Jpeg:
      return '.jpg';
    case MimeType.Mov:
      return '.mov';
    case MimeType.Mp4:
      return '.mp4';
    case MimeType.Pdf:
      return '.pdf';
    case MimeType.Png:
      return '.png';
  }

  const nope: never = mimeType;
  return nope;
}
