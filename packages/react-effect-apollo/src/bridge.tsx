import * as React from 'react';
import * as PropTypes from 'prop-types';
import {RenderPromises as ApolloRenderPromises, Query} from 'react-apollo';
import {Effect} from '@shopify/react-effect';

export const EFFECT_ID = Symbol('apollo');

export enum InflightQueryBehavior {
  SkipSubtree,
  RenderSubtree,
}

interface Options {
  inflightQueryBehavior?: InflightQueryBehavior;
}

// It is important to understand React Apollo’s server rendering logic
// before diving in to this code. You can read about it here:
// https://github.com/apollographql/react-apollo/blob/master/src/getDataFromTree.ts

class RenderPromises extends ApolloRenderPromises {
  private inflightQueryBehavior: InflightQueryBehavior;

  constructor({
    inflightQueryBehavior,
  }: {
    inflightQueryBehavior: InflightQueryBehavior;
  }) {
    super();
    this.inflightQueryBehavior = inflightQueryBehavior;
  }

  addQueryPromise<Data, Variables>(
    queryInstance: Query<Data, Variables>,
    finish: () => React.ReactNode,
  ) {
    const result = super.addQueryPromise(queryInstance, finish);
    return this.inflightQueryBehavior === InflightQueryBehavior.RenderSubtree &&
      result == null
      ? finish()
      : result;
  }
}

const effectKind = {id: EFFECT_ID};

export function createApolloBridge({
  inflightQueryBehavior = InflightQueryBehavior.RenderSubtree,
}: Options = {}): React.ComponentType<{}> {
  const renderPromises = new RenderPromises({inflightQueryBehavior});

  class ApolloBridge extends React.Component<{}> {
    static childContextTypes = {
      renderPromises: PropTypes.object,
    };

    getChildContext() {
      return {renderPromises};
    }

    render() {
      return (
        <>
          {this.props.children}
          <Effect
            kind={effectKind}
            perform={() => {
              return renderPromises.hasPromises()
                ? renderPromises.consumeAndAwaitPromises()
                : undefined;
            }}
          />
        </>
      );
    }
  }

  return ApolloBridge;
}
