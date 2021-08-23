import {MimeType} from '../types';
import {getMimeTypeFromFilename} from '../get-mime-type-from-filename';

describe('getMimeTypeFromFilename', () => {
  it.each([
    [MimeType.Csv, 'customers.csv'],
    [MimeType.Gif, 'animated-image.gif'],
    [MimeType.Glb, 'sunglasses.glb'],
    [MimeType.Hls, 'video.m3u8'],
    [MimeType.Html, 'page.html'],
    [MimeType.Jpeg, 'image.jpeg'],
    [MimeType.Jpeg, 'image.jpg'],
    [MimeType.Js, 'script.js'],
    [MimeType.Json, 'object.json'],
    [MimeType.Mov, 'collection.mov'],
    [MimeType.Mp4, 'movie.mp4'],
    [MimeType.Pdf, 'document.pdf'],
    [MimeType.Png, 'image.png'],
    [MimeType.Text, 'text.txt'],
    [MimeType.Zip, 'files.zip'],
  ])('returns %s for %s', (mimeType, filename) => {
    const actualMimeType = getMimeTypeFromFilename(filename);

    expect(mimeType).toBe(actualMimeType);
  });

  it('returns undefined when the filename extension is not recognized', () => {
    const mimeType = getMimeTypeFromFilename('nope.abc');

    expect(mimeType).toBeUndefined();
  });
});
