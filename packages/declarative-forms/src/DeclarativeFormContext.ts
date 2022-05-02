import {makeObservable, observable, action} from 'mobx';

import {frameworkValidators, frameworkFormatters} from './defaults';
import {Decorator, FormContext, SharedContext} from './types';

export type DecorateFunction<T extends SharedContext = SharedContext> = (
  context: DeclarativeFormContext<T>,
) => void;
export interface ConstructorProps<T> extends Partial<FormContext<T>> {
  decorate?: DecorateFunction<T>;
}

export const defaultSharedContext: SharedContext = {
  errors: {generic: []},
  debug: false,
};

/**
 * This class is used to pass down a shared context accessible
 * from all points of the framework and outside of it.
 * The instance being shared is simply passed down through a {@link SchemaNode}'s parameter
 * so it's accessible at every level.
 */
export class DeclarativeFormContext<T extends SharedContext = SharedContext>
  implements FormContext {
  /**
   * Here is where we pass validators used for the frontend validation process.
   * by nature a validator returns instantly a validation error or null but since
   * it receives the node as an argument, it's also possible to act asynchronously
   * on the node if the validation process requires an external api or network call.
   * ```tsx
   * validators: {
   *  ...defaultValidators,
   *  customValidator,
   * }
   * ```
   * A few examples validators that come with the lib are {@link presenceValidator}, {@link lengthValidator} and {@link formatValidator}
   */
  public validators: FormContext['validators'];
  public values: FormContext['values'];
  public translators: FormContext['translators'];
  public formatters: FormContext['formatters'];
  public features: FormContext['features'];
  public decorators: Decorator[] = [];
  public sharedContext: FormContext<T>['sharedContext'];
  public nodes: FormContext<T>['nodes'] = new Map();

  constructor({
    decorate = () => {},
    validators = {},
    values = {},
    formatters = {},
    translators = {},
    sharedContext = {} as T,
    features,
  }: ConstructorProps<T>) {
    this.validators = {
      ...frameworkValidators,
      ...validators,
    };

    this.values = values || {};
    this.formatters = {
      ...frameworkFormatters,
      ...formatters,
    };

    this.translators = translators || {};
    this.features = features || {};

    this.sharedContext = sharedContext;

    decorate(this as DeclarativeFormContext<T>);

    makeObservable(this, {
      sharedContext: observable,
      updateContext: action,
      focusField: action,
    });
  }

  /**
   * Updates the shared context
   * updating passing a single object as the first argument merges the object
   * and retriggers every watcher on sharedContext while using a key/value retriggers only
   * watchers that looks for the changed value.
   */
  public updateContext<K extends keyof FormContext<T>['sharedContext']>(
    valueOrKey: K | Partial<FormContext<T>['sharedContext']>,
    value?: Partial<FormContext<T>['sharedContext'][K]>,
  ): void {
    if (value) {
      this.actualUpdateContext(valueOrKey as string, value);
    } else {
      this.oldUpdateContext(
        valueOrKey as Partial<FormContext<T>['sharedContext']>,
      );
    }
  }

  public focusField(nodePath = '') {
    this.sharedContext.focusedNode = nodePath;
  }

  /**
   * Decorations are applied once when the node is constructed later.
   * Normally, the `where` condition should not receive parameters from outside
   * the function scope if the value is dynamic
   * @returns chainable Decorator
   */
  public where(fn: Decorator['match']): Omit<Decorator, 'apply'> {
    const decorator = new Decorator(fn);
    this.decorators.push(decorator);
    return decorator;
  }

  public addInitialValuesAfterNode(
    nodeShortPath: string,
    values: FormContext['values'],
  ) {
    this.values[nodeShortPath] = values;
  }

  private oldUpdateContext(
    value: Partial<FormContext<T>['sharedContext']>,
  ): void {
    this.sharedContext = {
      ...this.sharedContext,
      ...value,
    };
  }

  private actualUpdateContext<K extends keyof FormContext<T>['sharedContext']>(
    key: K,
    value: Partial<FormContext<T>['sharedContext'][K]>,
  ): void {
    (this.sharedContext as FormContext<any>['sharedContext'])[key] = value;
  }
}
