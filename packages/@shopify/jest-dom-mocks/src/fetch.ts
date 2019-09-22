import fetchMock from 'fetch-mock';

type AugmentedFetchMock = typeof fetchMock & {
  isMocked(): boolean;
};

const mockSpies = [
  jest.spyOn(fetchMock, 'mock'),
  jest.spyOn(fetchMock, 'get'),
  jest.spyOn(fetchMock, 'put'),
  jest.spyOn(fetchMock, 'post'),
  jest.spyOn(fetchMock, 'delete'),
];

const restoreSpy = jest.spyOn(fetchMock, 'restore') as any;

function isMocked() {
  const wasMocked = mockSpies.some(spy => spy.mock.calls.length > 0);

  const wasRestored = restoreSpy.mock.calls.length > 0;

  return wasMocked && !wasRestored;
}

const augmentedFetchMock = fetchMock as AugmentedFetchMock;
augmentedFetchMock.isMocked = isMocked;

export default augmentedFetchMock;
