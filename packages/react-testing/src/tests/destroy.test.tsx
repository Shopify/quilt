import React from 'react';

import {mount} from '../mount';
import {destroyAll} from '../destroy';

describe('destroyAll()', () => {
  afterEach(() => {
    destroyAll();
  });

  it('destroys all constructed root elements that have not already been destroyed', () => {
    const rootOne = mount(<div>One</div>);
    const rootTwo = mount(<div>Two</div>);
    const rootThree = mount(<div>Three</div>);

    rootTwo.destroy();

    const rootOneSpy = jest.spyOn(rootOne, 'destroy');
    const rootTwoSpy = jest.spyOn(rootTwo, 'destroy');
    const rootThreeSpy = jest.spyOn(rootThree, 'destroy');

    destroyAll();

    expect(rootOneSpy).toHaveBeenCalled();
    expect(rootThreeSpy).toHaveBeenCalled();
    expect(rootTwoSpy).not.toHaveBeenCalled();
  });
});
