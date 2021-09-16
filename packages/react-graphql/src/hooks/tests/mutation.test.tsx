import React from 'react';
import {gql} from '@apollo/client';
import {createGraphQLFactory} from '@shopify/graphql-testing';

import useMutation from '../mutation';

import {mountWithGraphQL} from './utilities';

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
  it('returns result that contains the loaded data once the mutation finished running', async () => {
    const renderPropSpy = jest.fn(() => null);
    const graphQL = createGraphQL({UpdatePetMutation: mockMutationData});
    const mockMutation = await mountWithGraphQL(
      <MockMutation>{renderPropSpy}</MockMutation>,
      {graphQL},
    );

    await mockMutation.act(async () => {
      mockMutation.find('button')!.trigger('onClick', undefined as any);

      await graphQL.resolveAll();
    });

    expect(renderPropSpy).toHaveBeenLastCalledWith(
      expect.objectContaining({data: mockMutationData}),
    );
  });
});
