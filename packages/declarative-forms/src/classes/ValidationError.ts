interface ValidationErrorOptions {
  maximum?: number;
  minimum?: number;
  format?: string;
  error?: string;
  field?: string;
  message?: string;
}

/**
 * Instance generated when a validator is triggered on a node's value.
 * {@link useNode} automaticaly creates instances of this class for all {@link ContextErrors} found on the {@link SharedContext}
 */
export class ValidationError {
  constructor(public type: string, public data?: ValidationErrorOptions) {}
}
