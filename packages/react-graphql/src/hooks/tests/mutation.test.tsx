import * as React from 'react';
import gql from 'graphql-tag';
import {createGraphQLFactory} from '@shopify/graphql-testing';

import useMutation from '../mutation';
import {
  mountWithGraphQL,
  prepareAsyncReactTasks,
  teardownAsyncReactTasks,
} from './utilities';

const updatePetMutation = gql`
  mutation UpdatePetMutation($name: String!) {
    updatePet(name: $name) {
      id
    }
  }
`;

const createGraphQL = createGraphQLFactory();

function MockMutation({children}: {children: Function}) {
  const mutate = useMutation(updatePetMutation);
  const [response, setResponse] = React.useState();

  async function runMutation() {
    const response = await mutate();
    setResponse(response);
  }

  return (
    <>
      <button type="button" onClick={runMutation} />
      {children(response)}
    </>
  );
}

const mockMutationData = {
  updatePet: {id: 'new-pet-id-123', __typename: 'Cat'},
};

// This is skip because current `act` wrapper does not support async operation
// The test will pass if we update to `react-dom` v16.9.0-alpha.0
// and wrap `graphQL.resolveAll()` in an `act`
// https://github.com/facebook/react/issues/14769#issuecomment-481251431
// eslint-disable-next-line jest/no-disabled-tests
describe.skip('useMutation', () => {
  beforeEach(() => {
    prepareAsyncReactTasks();
  });

  afterEach(() => {
    teardownAsyncReactTasks();
  });

  it('returns result that contains the loaded data once the mutation finished running', async () => {
    const renderPropSpy = jest.fn(() => null);
    const graphQL = createGraphQL({UpdatePetMutation: mockMutationData});
    const mockMutation = await mountWithGraphQL(
      <MockMutation>{renderPropSpy}</MockMutation>,
      {graphQL},
    );

    mockMutation.find('button')!.trigger('onClick', undefined as any);
    await graphQL.resolveAll();

    expect(renderPropSpy).toHaveBeenLastCalledWith(
      expect.objectContaining({data: mockMutationData}),
    );
  });
});
