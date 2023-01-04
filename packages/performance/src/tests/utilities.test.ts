import {getResourceTypeFromEntry} from '../utilities';
import {EventType} from '../types';

describe('utilities', () => {
  describe('getResourceTypeFromEntry()', () => {
    it('returns "unsupported" for unsupported initiator types', () => {
      expect(
        getResourceTypeFromEntry({
          initiatorType: 'audio',
        } as PerformanceResourceTiming),
      ).toBe('unsupported');
    });

    it('returns stylesheet event type when initiatorType is css', () => {
      expect(
        getResourceTypeFromEntry({
          initiatorType: 'css',
        } as PerformanceResourceTiming),
      ).toBe(EventType.StyleDownload);
    });

    it('returns script event type when initiatorType is script', () => {
      expect(
        getResourceTypeFromEntry({
          initiatorType: 'script',
        } as PerformanceResourceTiming),
      ).toBe(EventType.ScriptDownload);
    });

    it('returns stylesheet event type when initiatorType is link and file extension is .css', () => {
      expect(
        getResourceTypeFromEntry({
          initiatorType: 'link',
          name: 'file.css',
        } as PerformanceResourceTiming),
      ).toBe(EventType.StyleDownload);
    });

    it('returns script event type when initiatorType is link and file extension is .js', () => {
      expect(
        getResourceTypeFromEntry({
          initiatorType: 'link',
          name: 'file.js',
        } as PerformanceResourceTiming),
      ).toBe(EventType.ScriptDownload);
    });
  });
});
