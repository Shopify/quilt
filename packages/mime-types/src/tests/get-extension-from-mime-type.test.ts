import {MimeType} from '../types';
import {getExtensionFromMimeType} from '../get-extension-from-mime-type';

describe('getExtensionFromMimeType', () => {
  assertExtensionForMimeType('.csv', MimeType.Csv);
  assertExtensionForMimeType('.gif', MimeType.Gif);
  assertExtensionForMimeType('.glb', MimeType.Glb);
  assertExtensionForMimeType('.html', MimeType.Html);
  assertExtensionForMimeType('.jpg', MimeType.Jpeg);
  assertExtensionForMimeType('.js', MimeType.Js);
  assertExtensionForMimeType('.json', MimeType.Json);
  assertExtensionForMimeType('.m3u8', MimeType.Hls);
  assertExtensionForMimeType('.mov', MimeType.Mov);
  assertExtensionForMimeType('.mp4', MimeType.Mp4);
  assertExtensionForMimeType('.webm', MimeType.Webm);
  assertExtensionForMimeType('.pdf', MimeType.Pdf);
  assertExtensionForMimeType('.png', MimeType.Png);
  assertExtensionForMimeType('.txt', MimeType.Text);
  assertExtensionForMimeType('.usdz', MimeType.Usdz);
  assertExtensionForMimeType('.zip', MimeType.Zip);
  assertExtensionForMimeType('.webp', MimeType.Webp);
  assertExtensionForMimeType('.heic', MimeType.Heic);
});

function assertExtensionForMimeType(extension: string, mimeType: MimeType) {
  // eslint-disable-next-line jest/require-top-level-describe
  test(`returns ${extension} for ${mimeType}`, () => {
    const actualExtension = getExtensionFromMimeType(mimeType);

    expect(extension).toBe(actualExtension);
  });
}
