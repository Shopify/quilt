import {MimeType} from '../types';
import {getMimeTypeFromFilename} from '../get-mime-type-from-filename';

describe('getMimeTypeFromFilename', () => {
  it.each([
    [MimeType.Gif, 'animated-image.gif'],
    [MimeType.Glb, 'sunglasses.glb'],
    [MimeType.Jpeg, 'image.jpeg'],
    [MimeType.Jpeg, 'image.jpg'],
    [MimeType.Mov, 'collection.mov'],
    [MimeType.Mp4, 'movie.mp4'],
    [MimeType.Pdf, 'document.pdf'],
    [MimeType.Png, 'image.png'],
    [MimeType.Hls, 'video.m3u8'],
  ])('returns %s for %s', (mimeType, filename) => {
    const actualMimeType = getMimeTypeFromFilename(filename);

    expect(mimeType).toBe(actualMimeType);
  });

  it('returns undefined when the filename extension is not recognized', () => {
    const mimeType = getMimeTypeFromFilename('nope.abc');

    expect(mimeType).toBeUndefined();
  });
});
