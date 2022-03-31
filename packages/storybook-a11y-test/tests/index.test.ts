/* eslint-env node */

import {A11yTestRunner} from '../src/index';
import path from 'path';

const stories = require('../build/storybook/static/stories.json');

const iframePath = path.join(__dirname, '../build/storybook/static');

describe('can test a story', () => {
  const testRunner = new A11yTestRunner(iframePath);

  afterAll(() => testRunner.teardown());

  it('primary should have no errors', async () => {
    const result = await testRunner.testPages({
      storyIds: ['example-button--primary'],
    });
    expect(result.length).toBe(0);
  });

  it('secondary should have a11y errors', async () => {
    const result = await testRunner.testPages({
      storyIds: ['example-button--secondary'],
    });
    expect(result.length).toBe(1);
  });

  it('a11y disabled should be skipped', async () => {
    const result = await testRunner.testPages({
      storyIds: ['example-button--a-11-y-disabled'],
    });
    expect(result.length).toBe(0);
  });
});
