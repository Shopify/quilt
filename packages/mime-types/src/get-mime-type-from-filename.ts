import {MimeType} from './types';

export function getMimeTypeFromFilename(filename: string) {
  const extension = getFileExtension(filename.toLowerCase());

  switch (extension) {
    case 'csv':
      return MimeType.Csv;
    case 'gif':
      return MimeType.Gif;
    case 'glb':
      return MimeType.Glb;
    case 'm3u8':
      return MimeType.Hls;
    case 'html':
      return MimeType.Html;
    case 'jpg':
    case 'jpeg':
      return MimeType.Jpeg;
    case 'js':
      return MimeType.Js;
    case 'json':
      return MimeType.Json;
    case 'mov':
      return MimeType.Mov;
    case 'mp4':
      return MimeType.Mp4;
    case 'webm':
      return MimeType.Webm;
    case 'pdf':
      return MimeType.Pdf;
    case 'png':
      return MimeType.Png;
    case 'txt':
      return MimeType.Text;
    case 'usdz':
      return MimeType.Usdz;
    case 'zip':
      return MimeType.Zip;
    case 'webp':
      return MimeType.Webp;
    case 'heic':
      return MimeType.Heic;
  }
}

function getFileExtension(filename: string) {
  const match = /(?:\.([^.]+))?$/.exec(filename);

  if (match) {
    return match[1];
  }
}
