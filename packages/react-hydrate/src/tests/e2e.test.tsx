import React from 'react';
import {faker} from '@faker-js/faker/locale/en';
import {createMount} from '@shopify/react-testing';

import {Hydrator} from '../Hydrator';
import {HydrationContext} from '../context';
import {HydrationManager} from '../manager';
import {HYDRATION_ATTRIBUTE} from '../shared';

// We want a custom mount so that each mounted instance gets
// its own HydrationManager, rather than using the default one
// provided by the React context.
const mount = createMount<
  {manager?: HydrationManager},
  {manager: HydrationManager}
>({
  context({manager = new HydrationManager()}) {
    return {manager};
  },
  render(element, {manager}) {
    return (
      <HydrationContext.Provider value={manager}>
        {element}
      </HydrationContext.Provider>
    );
  },
});

describe('react-hydrate', () => {
  it('renders a wrapping element with a hydration ID but no innerHTML when there are children', () => {
    const hydrator = mount(<Hydrator>{faker.word.words()}</Hydrator>);
    const wrapper = hydrator.find('div')!;

    expect(wrapper).toHaveReactDataProps({
      [HYDRATION_ATTRIBUTE]: expect.any(String),
    });

    expect(wrapper).not.toHaveReactProps({
      dangerouslySetInnerHTML: expect.anything(),
    });
  });

  it('includes the original content when children are passed', () => {
    const content = faker.word.words();
    const hydrator = mount(<Hydrator>{content}</Hydrator>);
    expect(hydrator.find('div')).toContainReactText(content);
  });

  it('uses an explicit ID as part of the hydration attribute when provided', () => {
    const id = faker.string.uuid();
    const hydrator = mount(<Hydrator id={id}>{faker.word.words()}</Hydrator>);
    expect(hydrator.find('div')).toHaveReactDataProps({
      [HYDRATION_ATTRIBUTE]: expect.stringContaining(id),
    });
  });

  it('uses different IDs for multiple hydrator components', () => {
    const [hydratorOne, hydratorTwo] = mount(
      // eslint-disable-next-line @shopify/jsx-prefer-fragment-wrappers
      <div>
        <Hydrator>{faker.word.words()}</Hydrator>
        <Hydrator>{faker.word.words()}</Hydrator>
      </div>,
    ).findAll(Hydrator);

    expect(
      hydratorOne.find('div')!.data(HYDRATION_ATTRIBUTE),
    ).not.toStrictEqual(hydratorTwo.find('div')!.data(HYDRATION_ATTRIBUTE));
  });

  it('uses the content from a matching hydration element when mounting without children', () => {
    const content = faker.word.words();

    // This simulates the server render
    const serverHydrator = mount(<Hydrator>{content}</Hydrator>);

    // And this simulates the client render (note that the server rendered content
    // is still present, which allows the hydrated content to be extracted). In this
    // scenario, the client does not have the same information as the server, hence
    // why it has none of its original children.
    const clientHydrator = mount(<Hydrator />);

    expect(serverHydrator.find('div')!.data(HYDRATION_ATTRIBUTE)).toStrictEqual(
      clientHydrator.find('div')!.data(HYDRATION_ATTRIBUTE),
    );

    expect(clientHydrator.find('div')).toHaveReactProps({
      dangerouslySetInnerHTML: {__html: content},
    });
  });
});
