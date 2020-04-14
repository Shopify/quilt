import React from 'react';
import {matchMedia, mediaQueryList} from '@shopify/jest-dom-mocks';
import {mount} from '@shopify/react-testing';

import {useMedia} from '../media';

function MockComponent({mediaQuery}: {mediaQuery: string}) {
  const matchedQuery = useMedia(mediaQuery);
  const message = matchedQuery ? 'matched' : 'did not match';
  return <div>{message}</div>;
}

describe('useMedia', () => {
  beforeEach(() => {
    matchMedia.mock();
  });

  afterEach(() => {
    matchMedia.restore();
  });

  it('installs/uninstalls listeners', () => {
    const media = mediaQueryList({
      matches: true,
    });
    const mediaAddSpy = jest.spyOn(media, 'addListener');
    const mediaRemoveSpy = jest.spyOn(media, 'removeListener');

    matchMedia.setMedia(() => media);

    const mockComponent = mount(<MockComponent mediaQuery="print" />);
    expect(mediaAddSpy).toHaveBeenCalled();

    mockComponent.unmount();
    expect(mediaRemoveSpy).toHaveBeenCalled();
  });

  it('installs new listeners when mediaQuery used by hook changes', () => {
    const media = mediaQueryList({
      matches: true,
    });
    const mediaAddSpy = jest.spyOn(media, 'addListener');
    const mediaRemoveSpy = jest.spyOn(media, 'removeListener');

    matchMedia.setMedia(() => media);

    const mockComponent = mount(<MockComponent mediaQuery="print" />);
    expect(mediaAddSpy).toHaveBeenCalled();
    expect(mediaRemoveSpy).not.toHaveBeenCalled();

    mockComponent.setProps({mediaQuery: 'screen'});

    expect(mediaRemoveSpy).toHaveBeenCalled();
    expect(mediaAddSpy).toHaveBeenCalledTimes(2);
  });

  it('initial render when matches', () => {
    matchMedia.setMedia(() =>
      mediaQueryList({
        matches: true,
      }),
    );

    const mockComponent = mount(<MockComponent mediaQuery="print" />);
    expect(mockComponent.text()).toContain('matched');
  });

  it('initial render when does not match', () => {
    matchMedia.setMedia(() =>
      mediaQueryList({
        matches: false,
      }),
    );

    const mockComponent = mount(<MockComponent mediaQuery="print" />);
    expect(mockComponent.text()).toContain('did not match');
  });

  it('rerenders when the media changes from !match=>match', () => {
    const media = mediaQueryList({
      matches: false,
    });
    const addListenerSpy = jest.spyOn(media, 'addListener');
    matchMedia.setMedia(() => media);

    const mockComponent = mount(<MockComponent mediaQuery="print" />);
    expect(mockComponent.text()).toContain('did not match');

    expect(addListenerSpy).toHaveBeenCalled();
    mockComponent.act(() => {
      matchMedia.setMedia(() =>
        mediaQueryList({
          matches: true,
        }),
      );

      // setMedia API does not actually invoke the listeners registered by the hook, so we must invoke manually
      const [listener] = addListenerSpy.mock.calls[0];
      (listener as any)({...media, matches: true});
    });

    expect(mockComponent.text()).toContain('matched');
  });
});
