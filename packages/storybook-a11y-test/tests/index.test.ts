/* eslint-env node */
import path from 'path';
import {exec} from 'child_process';

import {A11yTestRunner} from '../src/index';

const buildDir = path.join(__dirname, './fixtures/storybook');

jest.setTimeout(180000);

describe('can test a story', () => {
  beforeAll(() => {
    return new Promise((resolve, reject) => {
      const icuDataPath = path.dirname(require.resolve('full-icu'));
      exec(
        `NODE_ICU_DATA=${icuDataPath} yarn run build-storybook`,
        {
          cwd: path.resolve(__dirname, '../'),
        },
        (error) => {
          if (error) {
            reject(new Error(`Unable to build storybook. ${error}`));
          } else {
            resolve();
          }
        },
      );
    });
  });

  afterAll(() => testRunner.teardown());

  const testRunner = new A11yTestRunner(buildDir);

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

  it('default a11y disabled is skipped', async () => {
    const result = await testRunner.testStories({
      storyIds: ['a11ydisabled-button--a-11-y-disabled-primary'],
    });
    expect(result).toHaveLength(0);
  });

  it('can collect story ids from stories.json', async () => {
    const stories = await testRunner.collectStoryIdsFromStoriesJSON();

    expect(stories).toHaveLength(5);
  });

  it('can collect enabled stories from iFrame', async () => {
    const stories = await testRunner.collectEnabledStoryIdsFromIFrame();

    expect(stories).toHaveLength(3);
  });
});
