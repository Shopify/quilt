/* eslint-env node */

import { testPages } from '../src/index'
import path from 'path'

const stories = require('../build/storybook/static/stories.json');

const iframePath = path.join('file://', __dirname, '../build/storybook/static/iframe.html')

console.log({ stories })

describe('can test a story', () => {
    it('should be able to test the button story', async () => {
        const result = await testPages({iframePath , storyIds: ['example-button--primary']});
        expect(result).toBeEmpty();
    })

    /*it('should skip the a11y disabled story', async () => {
        const result = await testPages({iframePath , storyIds: ['example-button--a-11-y-disabled']});
        expect(result).toBeEmpty();
    })*/
})
