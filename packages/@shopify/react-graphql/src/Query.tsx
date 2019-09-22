import React from 'react';
import {Query as ApolloQuery} from 'react-apollo';
import {OperationVariables} from 'apollo-client';

import {QueryProps} from './types';

// eslint-disable-next-line react/prefer-stateless-function
class QueryTypeClass<
  Data = any,
  Variables = OperationVariables
> extends React.Component<QueryProps<Data, Variables>> {}

export const Query: typeof QueryTypeClass = ApolloQuery as any;
