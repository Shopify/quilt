import React from 'react';
import faker from 'faker';
import {mount} from '@shopify/react-testing';
import {fetch, timer, connection} from '@shopify/jest-dom-mocks';
import {Method, Header} from '@shopify/network';

import {mockPerformance, randomConnection} from './utilities';

import {PerformanceReport, PerformanceContext} from '..';

describe('<PerformanceReport />', () => {
  beforeEach(() => {
    timer.mock();
    fetch.mock('*', 200);
  });

  afterEach(() => {
    if (connection.isMocked()) {
      connection.restore();
    }
    timer.restore();
    fetch.restore();
  });

  it('sends a report to the given url when a navigation event occurs', () => {
    const performance = mockPerformance();
    const url = faker.internet.url();

    mount(
      <PerformanceContext.Provider value={performance}>
        <PerformanceReport url={url} />
      </PerformanceContext.Provider>,
    );

    const navigation = performance.simulateNavigation();
    timer.runAllTimers();

    const [fetchedUrl, {body, method, headers}] = fetch.lastCall();
    expect(fetchedUrl).toBe(url);
    expect(method).toBe(Method.Post);
    expect(headers).toHaveProperty(Header.ContentType, 'application/json');
    expect(JSON.parse(body!.toString())).toMatchObject({
      navigations: [
        {
          details: navigation.toJSON({removeEventMetadata: false}),
          metadata: navigation.metadata,
        },
      ],
    });
  });

  it('sends a report to the given url when a lifeCycleEvent event occurs', () => {
    const performance = mockPerformance();
    const url = faker.internet.url();

    mount(
      <PerformanceContext.Provider value={performance}>
        <PerformanceReport url={url} />
      </PerformanceContext.Provider>,
    );

    const event = performance.simulateLifecycleEvent();
    timer.runAllTimers();

    const [fetchedUrl, {body, method, headers}] = fetch.lastCall();
    expect(fetchedUrl).toBe(url);
    expect(method).toBe(Method.Post);
    expect(headers).toHaveProperty(Header.ContentType, 'application/json');
    expect(JSON.parse(body!.toString())).toMatchObject({
      events: [event],
    });
  });

  it('batches multiple navigations and events into one report', () => {
    const performance = mockPerformance();

    mount(
      <PerformanceContext.Provider value={performance}>
        <PerformanceReport url={faker.internet.url()} />
      </PerformanceContext.Provider>,
    );

    const navigations = [
      performance.simulateNavigation(),
      performance.simulateNavigation(),
    ];
    const events = [
      performance.simulateLifecycleEvent(),
      performance.simulateLifecycleEvent(),
    ];
    timer.runAllTimers();

    const [, {body}] = fetch.lastCall();
    const parsedBody = JSON.parse(body!.toString());

    expect(parsedBody).toMatchObject({
      events,
      navigations: navigations.map(navigation => ({
        details: navigation.toJSON({removeEventMetadata: false}),
        metadata: navigation.metadata,
      })),
    });
  });

  it('includes connection details in reports', () => {
    const performance = mockPerformance();
    const mockConnection = randomConnection();
    connection.mock(mockConnection);

    mount(
      <PerformanceContext.Provider value={performance}>
        <PerformanceReport url={faker.internet.url()} />
      </PerformanceContext.Provider>,
    );

    performance.simulateNavigation();
    timer.runAllTimers();

    const [, {body}] = fetch.lastCall();
    expect(JSON.parse(body!.toString())).toMatchObject({
      connection: mockConnection,
    });
  });

  it('includes locale in reports', () => {
    const performance = mockPerformance();
    const mockConnection = randomConnection();
    connection.mock(mockConnection);

    mount(
      <PerformanceContext.Provider value={performance}>
        <PerformanceReport url={faker.internet.url()} locale="zh-CN" />
      </PerformanceContext.Provider>,
    );

    performance.simulateNavigation();
    timer.runAllTimers();

    const [, {body}] = fetch.lastCall();
    expect(JSON.parse(body!.toString())).toMatchObject({
      locale: 'zh-CN',
    });
  });
});
