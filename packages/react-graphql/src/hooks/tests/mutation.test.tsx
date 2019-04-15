import * as React from 'react';
import {act} from 'react-dom/test-utils';
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

describe('useMutation', () => {
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

    // @ts-ignore
    await act(async () => {
      await graphQL.resolveAll();
    });

    expect(renderPropSpy).toHaveBeenLastCalledWith(
      expect.objectContaining({data: mockMutationData}),
    );
  });
});
