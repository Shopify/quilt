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

  it('only keeps the last added meta based on name or property', () => {
    const globalDescription = 'global description';
    const pageDescription = 'page description';

    const manager = new HtmlManager();

    mountWithManager(
      <>
        <Meta name="desciption" content={globalDescription} />
        <Meta property="og:description" content={globalDescription} />
        <Meta name="desciption" content={pageDescription} />
        <Meta property="og:description" content={pageDescription} />
      </>,
      manager,
    );

    expect(manager.state.metas).toMatchObject([
      {
        content: 'page description',
        property: 'og:description',
      },
      {
        content: 'page description',
        name: 'desciption',
      },
    ]);
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
