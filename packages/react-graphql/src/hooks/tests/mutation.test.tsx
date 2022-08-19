import React from 'react';
import {gql, ErrorPolicy} from '@apollo/client';
import {createGraphQLFactory} from '@shopify/graphql-testing';
import {GraphQLError} from 'graphql';

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

function MockMutation({
  children,
  errorPolicy = 'none',
}: {
  children: Function;
  errorPolicy?: ErrorPolicy;
}) {
  const mutate = useMutation(updatePetMutation, {errorPolicy});
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

  it('returns result that contains errors when the errorPolicy allows for it', async () => {
    const renderPropSpy = jest.fn(() => null);
    const graphQL = createGraphQL({
      UpdatePetMutation: new GraphQLError('error'),
    });
    const mockMutation = await mountWithGraphQL(
      <MockMutation errorPolicy="all">{renderPropSpy}</MockMutation>,
      {graphQL},
    );

    await mockMutation.act(async () => {
      mockMutation.find('button')!.trigger('onClick', undefined as any);

      await graphQL.resolveAll();
    });

    expect(renderPropSpy).toHaveBeenLastCalledWith(
      expect.objectContaining({
        errors: [expect.any(GraphQLError)],
      }),
    );
  });
});
