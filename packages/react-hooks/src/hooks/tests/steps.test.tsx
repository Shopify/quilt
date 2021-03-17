import React from 'react';
import {mount} from '@shopify/react-testing';

import {useSteps} from '../steps';

describe('useSteps', () => {
  function TestMyProps(_props: any) {
    return null;
  }

  function MockComponent({
    steps,
    initialStep,
  }: {
    steps: number;
    initialStep?: number;
  }) {
    const props = useSteps(steps, initialStep);
    return <TestMyProps {...props} />;
  }

  it('starts with current step set to 1', () => {
    const wrapper = mount(<MockComponent steps={3} />);

    expect(wrapper).toContainReactComponent(TestMyProps, {
      currentStep: 1,
    });
  });

  it('sets custom initial step when initialStep is provided', () => {
    const wrapper = mount(<MockComponent steps={3} initialStep={2} />);

    expect(wrapper).toContainReactComponent(TestMyProps, {
      currentStep: 2,
    });
  });

  it('sets the next step when nextStep is called', () => {
    const wrapper = mount(<MockComponent steps={3} />);

    wrapper.find(TestMyProps).trigger('nextStep');
    expect(wrapper).toContainReactComponent(TestMyProps, {
      currentStep: 2,
    });

    wrapper.find(TestMyProps).trigger('nextStep');
    expect(wrapper).toContainReactComponent(TestMyProps, {
      currentStep: 3,
    });
  });

  it('sets the previous step when previousStep is called', () => {
    const wrapper = mount(<MockComponent steps={3} initialStep={2} />);

    wrapper.find(TestMyProps).trigger('previousStep');
    expect(wrapper).toContainReactComponent(TestMyProps, {
      currentStep: 1,
    });

    wrapper.find(TestMyProps).trigger('previousStep');
    expect(wrapper).toContainReactComponent(TestMyProps, {
      currentStep: 1,
    });
  });

  it('does not set next step when current step is the last', () => {
    const wrapper = mount(<MockComponent steps={2} initialStep={1} />);

    expect(wrapper).toContainReactComponent(TestMyProps, {
      currentStep: 1,
    });

    wrapper.find(TestMyProps).trigger('nextStep');
    expect(wrapper).toContainReactComponent(TestMyProps, {
      currentStep: 2,
    });
  });

  it('does not set previous step when current step is the first', () => {
    const wrapper = mount(<MockComponent steps={3} />);

    expect(wrapper).toContainReactComponent(TestMyProps, {
      currentStep: 1,
    });

    wrapper.find(TestMyProps).trigger('previousStep');
    expect(wrapper).toContainReactComponent(TestMyProps, {
      currentStep: 1,
    });
  });
});
