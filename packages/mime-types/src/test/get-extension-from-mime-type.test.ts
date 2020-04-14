import {MimeType} from '../types';
import {getExtensionFromMimeType} from '../get-extension-from-mime-type';

describe('getExtensionFromMimeType', () => {
  assertExtensionForMimeType('.gif', MimeType.Gif);
  assertExtensionForMimeType('.glb', MimeType.Glb);
  assertExtensionForMimeType('.jpg', MimeType.Jpeg);
  assertExtensionForMimeType('.mov', MimeType.Mov);
  assertExtensionForMimeType('.mp4', MimeType.Mp4);
  assertExtensionForMimeType('.pdf', MimeType.Pdf);
  assertExtensionForMimeType('.png', MimeType.Png);
});

function assertExtensionForMimeType(extension: string, mimeType: MimeType) {
  // eslint-disable-next-line jest/require-top-level-describe
  test(`returns ${extension} for ${mimeType}`, () => {
    const actualExtension = getExtensionFromMimeType(mimeType);

    expect(extension).toBe(actualExtension);
  });
}
