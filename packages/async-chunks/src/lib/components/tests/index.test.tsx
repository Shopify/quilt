import * as React from 'react';
import Enzyme, {mount} from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import AsyncChunk, {preloadReady, preloadAll} from '../AsyncChunk';

Enzyme.configure({adapter: new Adapter()});

const utilities = require('../utilities');

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function mockLoader(msDelay, loader, error = new Error('failed')) {
  return () => {
    return delay(msDelay).then(() => {
      if (loader) {
        return loader();
      } else {
        throw error;
      }
    });
  };
}

function Loading(props) {
  return <div>Loading: {JSON.stringify(props)}</div>;
}

function FooComponent(props) {
  return <div>FooComponent: {JSON.stringify(props)}</div>;
}

describe('AsyncChunk', () => {
  beforeEach(() => {
    utilities.isWebpackReady = jest.fn(() => true);
  });
  afterEach(() => {
    utilities.isWebpackReady.mockReset();
  });

  describe('Loading component', () => {
    it('renders with isLoading as true and pastDelay as false before the delay has completed', async () => {
      const Component = AsyncChunk({
        // mock load time of 500ms
        loader: mockLoader(500, () => FooComponent),
        loading: Loading,
        webpack: () => [1],
      });

      // flush initializers on client
      preloadReady();
      const renderedComponent = mount(<Component />);

      const metaData = renderedComponent.text().split('Loading: ')[1];
      const {isLoading, pastDelay} = JSON.parse(metaData);
      expect(isLoading).toEqual(true);
      expect(pastDelay).toEqual(false);
    });

    it('renders with isLoading as true and pastDelay as true after the delay has completed', async () => {
      const Component = AsyncChunk({
        // mock load time of 500ms
        loader: mockLoader(500, () => FooComponent),
        loading: Loading,
        webpack: () => [1],
      });

      // flush initializers on client
      preloadReady();
      const renderedComponent = mount(<Component />);

      await delay(250);
      const metaData = renderedComponent.text().split('Loading: ')[1];
      const {isLoading, pastDelay} = JSON.parse(metaData);
      expect(isLoading).toEqual(true);
      expect(pastDelay).toEqual(true);
    });
  });

  describe('FooComponent', () => {
    it('renders completely after the 500ms mock load time is finished ', async () => {
      const Component = AsyncChunk({
        loader: mockLoader(500, () => FooComponent),
        loading: Loading,
        webpack: () => [1],
      });

      const renderedComponent = mount(<Component />);

      await delay(550);
      expect(renderedComponent.text()).toBe('FooComponent: {}');
    });
  });

  describe('SSR', () => {
    it('loads the server side rendered component', async () => {
      const Component = AsyncChunk({
        loader: mockLoader(250, () => FooComponent),
        loading: Loading,
        webpack: () => [1],
      });

      // preload all component "on server"
      await preloadAll();
      const renderedComponent = mount(<Component />);

      expect(renderedComponent.text()).toBe('FooComponent: {}');
    });
  });

  describe('#preload', () => {
    it('loads the component on preload()', async () => {
      const Component = AsyncChunk({
        loader: mockLoader(500, () => FooComponent),
        loading: Loading,
        webpack: () => [1],
      });

      preloadReady();
      const renderedComponent = mount(<Component />);
      const metaData = renderedComponent.text().split('Loading: ')[1];
      const {isLoading} = JSON.parse(metaData);

      expect(isLoading).toEqual(true);
      await Component.preload();
      expect(renderedComponent.text()).toBe('FooComponent: {}');
    });
  });
});
