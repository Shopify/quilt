import React from 'react';
import {matchMedia, mediaQueryList} from '@shopify/jest-dom-mocks';
import {mount} from '@shopify/react-testing';

import {useMedia, useMediaLayout} from '../media';

describe('useMedia and useMediaLayout', () => {
  beforeEach(() => {
    matchMedia.mock();
  });

  afterEach(() => {
    matchMedia.restore();
  });

  describe.each([
    ['useMedia', useMedia],
    ['useMediaLayout', useMediaLayout],
  ])('%s', (_, useEffectHook) => {
    function MockComponent({mediaQuery}: {mediaQuery: string}) {
      const matchedQuery = useEffectHook(mediaQuery);
      const message = matchedQuery ? 'matched' : 'did not match';
      return <div>{message}</div>;
    }

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

    it('only installs a single listener, shared between hooks', () => {
      const media = mediaQueryList({
        matches: true,
      });
      const mediaAddSpy = jest.spyOn(media, 'addListener');
      const mediaRemoveSpy = jest.spyOn(media, 'removeListener');

      matchMedia.setMedia(() => media);

      const mockComponent1 = mount(<MockComponent mediaQuery="print" />);
      const mockComponent2 = mount(<MockComponent mediaQuery="print" />);
      expect(mediaAddSpy).toHaveBeenCalledTimes(1);

      mockComponent1.unmount();
      expect(mediaRemoveSpy).not.toHaveBeenCalled();

      mockComponent2.unmount();
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

    it('rerenders single when the media changes from !match=>match', () => {
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

    it('rerenders multiple components when the media changes from !match=>match', () => {
      const media = mediaQueryList({
        matches: false,
      });
      const addListenerSpy = jest.spyOn(media, 'addListener');
      matchMedia.setMedia(() => media);

      const mockComponent = mount(
        // eslint-disable-next-line @shopify/jsx-prefer-fragment-wrappers
        <div>
          <MockComponent mediaQuery="print" />
          <MockComponent mediaQuery="print" />
        </div>,
      );
      expect(mockComponent.text()).toContain('did not match');

      expect(addListenerSpy).toHaveBeenCalledTimes(1);
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

      expect(mockComponent.text()).toMatch(/matched.*matched/);
    });
  });
});
