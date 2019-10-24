import React from 'react';
import faker from 'faker';

import {extract} from '@shopify/react-effect/server';
import {HtmlManager, HtmlContext} from '@shopify/react-html';
import {mount} from '@shopify/react-testing';

import {createUniversalProvider} from '../create-universal-provider';

const id = 'random';
const RandomContext = React.createContext<string | undefined>(undefined);
const RandomProvider = createUniversalProvider(id, RandomContext);

describe('createUniversalProvider()', () => {
  it('renders a RandomContext with value from the value prop', () => {
    const randomValue = faker.lorem.word();
    const randomProvider = mount(<RandomProvider value={randomValue} />);

    expect(randomProvider).toProvideReactContext<string | undefined>(
      RandomContext,
      randomValue,
    );
  });

  it('renders a RandomContext.Provider with value from the serializer', async () => {
    const htmlManager = new HtmlManager();
    const randomValue = faker.lorem.word();

    // Simulated server render
    await extract(<RandomProvider value={randomValue} />, {
      decorate: (element: React.ReactNode) => (
        <HtmlContext.Provider value={htmlManager}>
          {element}
        </HtmlContext.Provider>
      ),
    });

    const randomProvider = mount(
      <HtmlContext.Provider value={htmlManager}>
        <RandomProvider />
      </HtmlContext.Provider>,
    );

    expect(randomProvider).toProvideReactContext<string | undefined>(
      RandomContext,
      randomValue,
    );
  });

  it('renders a RandomContext.Provider with value from server when value are provided on both server and client', async () => {
    const htmlManager = new HtmlManager();
    const serverRandomValue = faker.lorem.word();
    const clientRandomValue = faker.lorem.word();

    // Simulated server render
    await extract(<RandomProvider value={serverRandomValue} />, {
      decorate: (element: React.ReactNode) => (
        <HtmlContext.Provider value={htmlManager}>
          {element}
        </HtmlContext.Provider>
      ),
    });

    const randomProvider = mount(
      <HtmlContext.Provider value={htmlManager}>
        <RandomProvider value={clientRandomValue} />
      </HtmlContext.Provider>,
    );

    expect(randomProvider).toProvideReactContext<string | undefined>(
      RandomContext,
      serverRandomValue,
    );
  });
});
