import React from 'react';
import {mount} from '@shopify/react-testing';
import {Performance as PerformanceManager} from '@shopify/performance';

import {PerformanceContext} from '../context';
import {PerformanceProvider} from '../PerformanceProvider';

jest.mock('@shopify/performance', () => {
  class Performance {
    constructor() {}
  }

  return {Performance};
});

jest.mock('../utilities', () => ({
  isServer: jest.fn(),
}));

const {isServer} = require.requireMock('../utilities') as {
  isServer: jest.Mock;
};

describe('<PerformanceProvider />', () => {
  beforeEach(() => {
    isServer.mockImplementation(() => false);
  });

  it('renders PerformanceContext.Provider with performance manager as value', () => {
    const performanceProvider = mount(<PerformanceProvider />);

    expect(performanceProvider).toProvideReactContext(
      PerformanceContext,
      expect.any(PerformanceManager),
    );
  });

  it('renders PerformanceContext.Provider with no value if isServer=true', () => {
    isServer.mockImplementation(() => true);
    const performanceProvider = mount(<PerformanceProvider />);

    expect(performanceProvider).toProvideReactContext(
      PerformanceContext,
      undefined,
    );
  });
});
