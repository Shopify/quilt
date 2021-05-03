import {
  Validator,
  FieldStates,
  ErrorValue,
  ListValidationContext,
} from '../../../types';

export function runValidation<Value, Record extends object>(
  updateError: (error: ErrorValue) => void,
  state: {
    value: Value;
    listItem: FieldStates<Record>;
    siblings: Array<FieldStates<Record>>;
  },
  validators: Array<Validator<Value, ListValidationContext<Record>>>,
) {
  const {value, listItem, siblings} = state;

  const error = validators
    .map(check =>
      check(value, {
        listItem,
        siblings,
      }),
    )
    .filter(value => value != null);

  if (error && error.length > 0) {
    const [firstError] = error;
    updateError(firstError);
    return firstError;
  }

  updateError(undefined);
}
