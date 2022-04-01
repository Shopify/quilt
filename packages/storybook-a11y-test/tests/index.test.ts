/* eslint-env node */
import path from 'path';

import {A11yTestRunner} from '../src/index';

const buildDir = path.join(__dirname, './fixtures/storybook');

describe('can test a story', () => {
  const testRunner = new A11yTestRunner(buildDir);

  afterAll(() => testRunner.teardown());

  it('primary does not have no errors', async () => {
    const result = await testRunner.testStories({
      storyIds: ['example-button--primary'],
    });
    expect(result).toHaveLength(0);
  });

  it('secondary has a11y errors', async () => {
    const result = await testRunner.testStories({
      storyIds: ['example-button--secondary'],
    });
    expect(result).toHaveLength(1);
  });

  it('a11y disabled is skipped', async () => {
    const result = await testRunner.testStories({
      storyIds: ['example-button--a-11-y-disabled'],
    });
    expect(result).toHaveLength(0);
  });

  it('a11y ignored error passes', async () => {
    const result = await testRunner.testStories({
      storyIds: ['example-button--a-11-y-ignored'],
    });
    expect(result).toHaveLength(0);
  });

  it('can collect story ids from stories.json', async () => {
    const stories = await testRunner.collectStoryIdsFromStoriesJSON();

    expect(stories).toHaveLength(4);
  });

  it('can collect enabled stories from iFrame', async () => {
    const stories = await testRunner.collectEnabledStoryIdsFromIFrame();

    expect(stories).toHaveLength(3);
  });
});
