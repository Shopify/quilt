import {useCallback, useEffect, useState} from 'react';
import {autorun, trace} from 'mobx';

import {NodeValue, SchemaNode, SharedContext, CLONED_SYMBOL} from '../types';
import {Path} from '../classes/Path';

import {isSchemaNode} from './compatibility';
import {DeclarativeFormContext} from '../DeclarativeFormContext';
import {ValidationError} from '../classes/ValidationError';

interface Features {
  forceSelection?: boolean;
  allowUndefined?: boolean;
  contextOnly?: boolean;
  cloneName?: string;
}

/**
 * This hook tells react when an instance of {@link SchemaNode} changes including
 * external factors such as the {@link DeclarativeFormContext} containing the `sharedContext`.
 * @param node instance of {@link SchemaNode} to watch for changes
 */
export function useNode<
  T extends NodeValue = NodeValue,
  C extends SharedContext = SharedContext,
>(
  node: SchemaNode<T>,
  {
    forceSelection,
    allowUndefined = false,
    contextOnly = false,
    cloneName = CLONED_SYMBOL,
  }: Features = {},
) {
  let exists = true;
  if (!isSchemaNode<T>(node)) {
    if (allowUndefined) {
      node = new SchemaNode<T>(new DeclarativeFormContext({}), {});
      exists = false;
    } else {
      throw new Error('bad node type received');
    }
  }

  const getInvalidChildren = useCallback(() => {
    const children = [] as string[];
    node.invalidChildren.forEach((_, child) => children.push(child));
    return children;
  }, [node.invalidChildren]);

  // This proxy is usefull when passed directly to external components
  // avoid to lose the context or have to `node.onChange.bind(node)`
  const onChange = useCallback((val: T) => node.onChange(val), [node]);

  const [state, setState] = useState({
    focused: false,
    exists,
    value: node.value as T,
    errors: node.errors || [],
    serverErrors: [] as ValidationError[],
    errorMessage: node.getErrorMessage(),
    setInitialValue,
    isValid: node.isValid(),
    invalidChildren: getInvalidChildren(),
    sharedContext: node.context.sharedContext as C,
    /** @private used to keep track of the state change*/
    remoteErrors: node.context.sharedContext.errors,
  });

  useEffect(forceInitialSelectionEffect, [forceSelection, node]);
  useEffect(refreshStateFromObservableEffect, [node]);

  useEffect(
    function maybeUpdateErrorsFromContext() {
      return autorun(() => {
        const remoteErrors = node.context.sharedContext.errors;

        if (remoteErrors) {
          const serverPath = new Path('', node.path.segments.filter(({key}) => key !== cloneName)).toFullWithoutVariants()
          const serverErrorsTarget = remoteErrors
            ? remoteErrors[serverPath]
            : null;
          const externalErrors =
            mapContextErrorsToValidationErrors(serverErrorsTarget);
          node.setErrors(externalErrors);
        }
      });
    },
    [node, state.remoteErrors],
  );

  useEffect(
    function maybeUpdateFromWatchedNode() {
      return autorun(() => {
        const target =
          node.schema.watch && node.getNodeByPath(node.schema.watch);
        if (target && target.value !== node.value) node.onChange(target.value);
      });
    },
    [node],
  );

  return {...state, onChange};

  function setInitialValue(value: any) {
    setState({
      ...state,
      errors: node.onChange(value, undefined, true),
    });
  }

  function forceInitialSelectionEffect() {
    const [firstOptionValue] = node.attributes;
    if (
      forceSelection &&
      typeof node.value !== 'string' &&
      typeof firstOptionValue === 'string'
    ) {
      node.onChange(firstOptionValue as T);
    }
  }

  function refreshStateFromObservableEffect() {
    return autorun(() => {
      // this triggers a debugger on the next reaction
      if (node.context.sharedContext._debug_next_reaction) trace(true);

      const serverPath = node.path.toFullWithoutVariants();
      const focused = node.context.sharedContext.focusedNode === serverPath;
      const value = node.value;
      const isValid = node.isValid();
      const errors = node.errors;
      const errorMessage = node.getErrorMessage();
      const sharedContext = node.context.sharedContext as C;
      const remoteErrors = node.context.sharedContext.errors;

      setState((previousState) => {
        const contextHasChanged =
          previousState.sharedContext !== node.context.sharedContext;

        if (contextOnly && !contextHasChanged) return previousState;

        return {
          ...previousState,
          focused,
          remoteErrors,
          sharedContext,
          value,
          isValid,
          errors,
          errorMessage,
        };
      });
    });
  }
}

function mapContextErrorsToValidationErrors(
  stringErrors: string[] | null,
): ValidationError[] {
  return Array.isArray(stringErrors)
    ? stringErrors.map((error) => new ValidationError('server', {error}))
    : [];
}
