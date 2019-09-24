import React from 'react';
import {GraphQLOperationDetails} from './types';

export const GRAPHQL_OPERATIONS = Symbol('graphQLOperations');

export const GraphQLOperationsContext = React.createContext<
  GraphQLOperationDetails[] | []
>([]);
