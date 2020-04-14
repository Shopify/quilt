import {MimeType} from './types';

export function getMimeTypeFromFilename(filename: string) {
  const extension = getFileExtension(filename.toLowerCase());

  switch (extension) {
    case 'gif':
      return MimeType.Gif;
    case 'glb':
      return MimeType.Glb;
    case 'm3u8':
      return MimeType.Hls;
    case 'jpg':
    case 'jpeg':
      return MimeType.Jpeg;
    case 'mov':
      return MimeType.Mov;
    case 'mp4':
      return MimeType.Mp4;
    case 'pdf':
      return MimeType.Pdf;
    case 'png':
      return MimeType.Png;
  }
}

function getFileExtension(filename: string) {
  const match = /(?:\.([^.]+))?$/.exec(filename);

  if (match) {
    return match[1];
  }
}
