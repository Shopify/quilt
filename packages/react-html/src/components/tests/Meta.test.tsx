import React from 'react';

import {HtmlManager} from '../../manager';
import {Meta} from '../Meta';

import {mountWithManager} from './utilities';

describe('<Meta />', () => {
  it('adds a meta with the specified props', () => {
    const props = {content: 'foo'};
    const manager = new HtmlManager();
    const spy = jest.spyOn(manager, 'addMeta');

    mountWithManager(<Meta {...props} />, manager);

    expect(spy).toHaveBeenCalledWith(props);
  });

  it('removes meta after unmounting', () => {
    const manager = new HtmlManager();

    const meta = mountWithManager(
      <Meta name="desciption" content="test" />,
      manager,
    );

    expect(manager.state.metas).toHaveLength(1);

    meta.unmount();

    expect(manager.state.metas).toHaveLength(0);
  });
});
