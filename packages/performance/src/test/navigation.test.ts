import {Navigation} from '../navigation';
import {
  NavigationDefinition,
  NavigationMetadata,
  NavigationResult,
} from '../types';

describe('Navigation', () => {
  it('has a start time', () => {
    const start = Date.now();
    const navigation = createNavigation({start});
    expect(navigation).toHaveProperty('start', start);
  });

  it('has a duration', () => {
    const duration = 123;
    const navigation = createNavigation({duration});
    expect(navigation).toHaveProperty('duration', duration);
  });

  it('has a result', () => {
    const result = NavigationResult.Cancelled;
    const navigation = createNavigation({result});
    expect(navigation).toHaveProperty('result', result);
  });

  it('has a target', () => {
    const target = '/foobar';
    const navigation = createNavigation({target});
    expect(navigation).toHaveProperty('target', target);
  });

  it('has metadata', () => {
    const metadata = {
      index: 1,
      supportsDetailedEvents: false,
      supportsDetailedTime: true,
    };
    const navigation = createNavigation(undefined, metadata);
    expect(navigation).toHaveProperty(
      'metadata',
      expect.objectContaining(metadata),
    );
  });

  describe('#isFirstLoad', () => {
    it('is true when the navigation is index 0', () => {
      const navigation = createNavigation(undefined, {index: 0});
      expect(navigation).toHaveProperty('isFirstLoad', true);
    });

    it('is false when the navigation is not index 0', () => {
      const navigation = createNavigation(undefined, {index: 2});
      expect(navigation).toHaveProperty('isFirstLoad', false);
    });
  });
});

function createNavigation(
  details: Partial<NavigationDefinition> = {},
  metadata: Partial<NavigationMetadata> = {},
) {
  return new Navigation(
    {
      start: Date.now(),
      duration: 100,
      events: [],
      result: NavigationResult.Finished,
      target: '/admin',
      ...details,
    },
    {
      index: 0,
      supportsDetailedEvents: true,
      supportsDetailedTime: true,
      ...metadata,
    },
  );
}
